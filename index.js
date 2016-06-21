import colors from 'colors';

const path = require('path');
const Koa = require('koa');

const app = new Koa();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/build/assets')));
app.use(convert(require('koa-static')(__dirname + '/node_modules')));

app.use(views(__dirname + '/views', {
	extension: 'html.xtpl'
}));

const xtemplate = require('xtpl/lib/koa');
xtemplate(app, {
	views: __dirname + '/views'
});

// logger
app.use(async(ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

const router = require('./routes');
app.use(router.routes(), router.allowedMethods());

app.use(ctx => {
	if (ctx.status === 404) {
		ctx.body = 'You are lost in the world!';
	}
});

app.on('error', function(err, ctx) {
	console.log(err);
});

app.listen(3000, error => {
	if (error) {
		return console.log(error.stack);
	}
	console.log('Listening at http://localhost:3000'.underline.green);
});
