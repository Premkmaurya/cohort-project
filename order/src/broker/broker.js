const amqplib = require("amqplib");

let channel, connection;

async function connect() {
  if (connection) return connection;

  try {
    connection = await amqplib.connect(process.env.RABBIT_URL);
    console.log("rabbit MQ connected successfully");
    channel = await connection.createChannel();
  } catch (err) {
    console.log("error connecting to rabbit MQ", err);
  }
}

async function publishToQueue(queueName, data = {}) {
  if (!channel || !connection) await connect();

  await channel.assertQueue(queueName, {
    durable: true,
  });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
}

async function subscribeToQueue(queueName, callback) {
  if (!channel || !connection) await connect();

  await channel.assertQueue(queueName, {
    durable: true,
  });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.ToString());
      await callback(data);
      channel.ack(msg);
    }
  });
}

module.exports = {
  connect,
  channel,
  connection,
  publishToQueue,
  subscribeToQueue,
};
