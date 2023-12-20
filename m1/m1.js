const express = require("express");
const amqp = require("amqplib");
const validator = require("./utils/validator");
const schema = require("./utils/schema");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const queueName = "number";
const resultQueueName = "double";

// Function for connecting to RabbitMQ
async function connectRabbitMQ() {
	try {
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		await channel.assertQueue(resultQueueName, { durable: true });

		return channel;
	} catch (error) {
		throw error;
	}
}

app.post("/double", [validator(schema)], async (req, res, next) => {
	try {
		const number = req.body.number;
		logger.info(`Number: ${number}`);

		const channel = await connectRabbitMQ();

		// Sending a number to the queueName queue
		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(number)));

		// Promise for waiting for the processing result
		const resultPromise = new Promise(resolve => {
			// Subscribe to the resultQueueName queue to receive the result
			channel.consume(resultQueueName, msg => {
				const parsedResult = JSON.parse(msg.content.toString());
				channel.ack(msg);
				resolve(parsedResult);
			});
		});

		const result = await resultPromise;
		logger.info(`Result: ${result}`);

		await channel.close();

		return res.status(200).json({ message: result });
	} catch (error) {
		return next(error);
	}
});

app.use("*", (req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;

	return next(error);
});

app.use((error, req, res, next) => {
	logger.error(`Error: ${error.message}`);

	res.status(error.status || 500).json({
		message: error.message || "Internal Server Error",
	});
});

app.listen(PORT, () => {
	logger.info("Server M1 is running");
});
