const path = require('path');

const app = require('koa')();


const xtemplate = require('xtpl/lib/koa');
xtemplate(app, {
	views: path.join(__dirname, 'views')
});

const koaStatic = require('koa-static');
app.use(koaStatic(path.join(__dirname, '../build/assets')));
app.use(koaStatic(path.join(__dirname, '../node_modules')));

const router = require('./router');

app.use(router.routes());
app.use(router.allowedMethods());

app.use(function*(next) {
	if (this.status === 404) {
		this.body = 'You are lost in the world!';
	} else {
		yield next;
	}
});

app.on('error', error => {
	console.log(error.stack);
});

app.listen(3000, error => {
	if (error) {
		console.log(error.stack);
		return;
	}
	console.log('Listening at http://localhost:3000');
});
