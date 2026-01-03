const kafkaClient = require("./kafka_client")

const initAdmin = async () => {
    // responsible to create topics, partitions
    const admin = kafkaClient.admin()

    console.log('Admin connecting...')
    await admin.connect()
    console.log('Admin Connected')

    await admin.createTopics({
        topics: [
            {
                topic: 'pathway_triggers',
            }
        ],
        timeout: 5000, // time in ms to wait for a topic to be completely created on collector node
        validateOnly: false // the request will be validated, but the topic won't be created if true
    })
    console.log('Topic [pathway_triggers] created')

    const topics = await admin.listTopics()
    console.log('Available topics: ', topics)

    console.log('Admin disconnecting...')
    await admin.disconnect()
    console.log('Admin disconnected.')
}

module.exports = initAdmin