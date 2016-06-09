/**
 * 或者使用 co-fs 模块读取文件内容
 * @see https://github.com/tj/co-fs
 */

const fs = require('fs');

module.exports = filePath => {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(filePath)) {
			return reject({
				status: 'ERROR',
				code: '404',
				message: `文件${filePath}不存在`
			});
		}
		fs.readFile(filePath, (error, data) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(data);
		});
	});
}
