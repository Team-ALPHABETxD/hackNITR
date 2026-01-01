const { Kafka } = require("kafkajs")

const kafkaClient = new Kafka({
    clientId: 'krishak-sathi',
    brokers: ['kafka:9092']
})

module.exports = kafkaClient