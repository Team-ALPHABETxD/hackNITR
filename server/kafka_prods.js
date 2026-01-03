const kafkaClient = require("./kafka_client")

const trigger_producer = async () => {
    const producer = kafkaClient.producer({
        allowAutoTopicCreation: true,
        transactionTimeout: 30000
    })

    await producer.connect()
    const today = new Date().toISOString().slice(0, 10)

    await producer.send({
        topic: "pathway_triggers",
        messages: [{
            key: today,
            value: JSON.stringify({ date: today })
        }]
    })

    console.log("Written Succesfully!")

}

module.exports = trigger_producer