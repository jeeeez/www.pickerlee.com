/**
 * @see https://github.com/tj/co-fs
 */

const fs = require('co-fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = filePath => {
	if (filePath.includes('http')) {
		return fetch(filePath).then(res => res.text());
	} else {
		filePath = path.resolve(__dirname, '../assets/resources', filePath);
		return fs.readFile(filePath, 'utf-8');
	}
}
