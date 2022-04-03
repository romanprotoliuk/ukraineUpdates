const helmet = require('helmet');
const compression = require('compression');
/**
 * @desc   
 * Helmet - lets you configure the headers and prevent common vulnerabilities such as clickjacking, implementation of strict HTTP, and download options for vulnerable browsers such as IE8  
 * Compression - decreases the amount of downloadable data from a website or app. By using this compression, we can improve the performance of our Node.js applications as our payload size is dramatically reduced above 70%
 */
module.exports = (app) => {
	app.use(helmet());
	app.use(compression);
};
