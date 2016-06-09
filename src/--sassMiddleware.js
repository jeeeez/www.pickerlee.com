const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const postcssMiddleware = require('postcss-middleware');

const autoprefixer = require('autoprefixer');
const postcssSorting = require('postcss-sorting');

const srcPath = __dirname + '/assets/styles';
const destPath = path.resolve(__dirname + '/..') + '/build/assets/styles';

const sassInstance = sassMiddleware({
	src: srcPath,
	debug: true,
	dest: destPath,
	outputStyle: 'extended',
	prefix: '/styles',
	force: true,
	response: false
});
const sassMid = function*(next) {
	yield sassInstance.bind(sassInstance, this.req, this.res);
	yield next;
};

const fs = require('fs');
const fileReader = require('./utils/file-reader');
const postcss = require('postcss');
const postcssMid = function*(next) {
	if (/.+\.css\??/.test(this.req.url)) {
		const fromPath = destPath + '/main.css';
		const toPath = destPath + '/main.css';
		const css = yield fileReader(fromPath).then(data => data.toString()).catch(error => {
			return console.log(error);
		});
		const cssResult = yield postcss([autoprefixer({
				browsers: ['last 2 versions']
			}), postcssSorting({
				"sort-order": ["margin", "padding"]
			})])
			.process(css, {
				from: fromPath,
				to: toPath,
				map: {
					inline: false
				}
			})
			.then(function(result) {
				try {
					fs.writeFileSync(toPath, result.css);
					if (result.map) fs.writeFileSync(toPath + '.map', result.map);
					return result.css;
				} catch (error) {
					throw error;
				}
			}).catch(error => {
				console.log(JSON.stringify(error));
			});

		yield next;
	} else {
		yield next;
	}
};


module.exports = function() {
	return function*(next) {
		yield sassMid.call(this, postcssMid.call(this, next));
	}
}
