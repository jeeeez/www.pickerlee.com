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
		rootClassName: 'home',
		dateFormatter: (timestamp, format) => {
			return dateFormatter(new Date(timestamp), format);
		}
	});
});

router.get(`/article/:articleId`, function*(next) {
	const article = articleList[this.params.articleId];

	const html = yield fileReader(article.resource);

	yield this.render(`article.html`, {
		title: article.title,
		article,
		articleHTML: markdown.toHTML(html),
		rootClassName: 'markdown-body'
	});
});


module.exports = router;
