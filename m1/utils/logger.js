const winston = require("winston");
const path = require("path");

module.exports = winston.createLogger({
	level: "info",
	format: winston.format.combine(
		winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
		winston.format.simple()
	),
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, "../log", "logFile.log"),
		}),
	],
});
