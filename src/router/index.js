const path = require('path');
const template = require('./../utils/template');
const markdown = require('markdown').markdown;
const fileReader = require('./../utils/file-reader');
const dateFormatter = require('date-formatter/dist/date-formatter').default;

const router = require('koa-router')();
const articleList = require('../database/article-list.json');

router.get('/', function*(next) {
	yield this.render(`article-list.html`, {
		title: 'Home of Picker Lee >> www.pickerlee.com',
		articleList,
		dateFormatter: (timestamp, format = 'yyyy-MM-dd') => {
			return dateFormatter(new Date(timestamp), format);
		}
	});
});

router.get(`/article/:articleId`, function*(next) {
	const article = articleList[this.params.articleId];
	const resource = path.resolve(__dirname, '../resource', article.resource);

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


module.exports = router;
