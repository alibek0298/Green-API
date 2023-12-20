const amqp = require("amqplib");
const logger = require("./utils/logger");

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
		logger.error(`Error connecting to RabbitMQ ${error.message}`);
	}
}

(async () => {
	try {
		const channel = await connectRabbitMQ();

		// Subscribe to the resultQueueName queue to receive the request
		channel.consume(queueName, msg => {
			const number = JSON.parse(msg.content.toString());
			logger.info(`Get request: ${number}`);

			const result = number * 2;
			channel.ack(msg);

			setTimeout(() => {
				// Sending a result to the resultQueueName queue
				channel.sendToQueue(
					resultQueueName,
					Buffer.from(JSON.stringify(result))
				);

				logger.info(`Send result: ${result}`);
			}, 5000);
		});
	} catch (error) {
		logger.error(error.message);
	}
})();
