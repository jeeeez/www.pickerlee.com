const path = require('path');

const app = require('koa')();
const router = require('koa-router')();
const markdown = require('markdown').markdown;
const fileReader = require('./utils/file-reader');

const koaStatic = require('koa-static');
app.use(koaStatic(__dirname + '/assets'));

const xtemplate = require('xtpl/lib/koa');
xtemplate(app, {
	views: path.join(__dirname, 'views')
});


const static = require('koa-static');
app.use(static(path.join(__dirname, '../build/assets')));

const articleList = require('./database/article-list.json');

router.get('/', function*(next) {
	yield this.render(`article-list.html`, {
		title: 'Home of Picker Lee >> www.pickerlee.com',
		articleList
	});
});

router.get(`/article/:articleId`, function*(next) {
	const article = articleList[this.params.articleId];
	const resource = path.join(__dirname, 'resource', article.resource);

	const html = yield fileReader(resource).then(data => {
		return markdown.toHTML(data.toString());
	}).catch(error => {
		return JSON.stringify(error);
	});

	yield this.render(`article.html`, {
		title: article.title,
		body: html
	});
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(function*(next) {
	if (this.status === 404) {
		this.body = 'You are lost in the world!';
	} else {
		yield next;
	}
});

app.onerror = function(error) {
	console.log(error.stack);
}

app.listen(3000, error => {
	if (error) {
		throw new Error(error);
	}
	console.log('Listening at http://localhost:3000');
});
