const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")
const kafkaClient = require("./kafka_client")
require("dotenv").config()
const PORT = process.env.PORT || 3000


const app = express()
app.use(cors({
    origin: ["http://localhost/5000"]
}))

const httpServer = createServer(app)
// socket server creation
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5000",
    }
})

// kafka consumer
const kafkaConsumerService = async () => {
    const consumer = await kafkaClient.consumer({groupId: "temp"})
    console.log("Connecting Consumer")
    consumer.connect()
    console.log("connected Consumer")

    console.log("Consumer Subscribing topic")
    await consumer.subscribe({ topics: ['daily_crop_treatment'], fromBeginning: true }) // start from the beginning of the topic
    console.log("Consumer Subscribed ['daily_crop_treatment']")


    await consumer.run({
        eachMessage: async ({topic, message}) => {
            console.log(`Consumed from ${topic} | 
                message: ${message.value.toString()}`)
        }
    })
}

kafkaConsumerService()

app.get('/', (req, res) => {
    return res.send("Hello from server")
})

httpServer.listen(PORT, () => console.log("Server is running on ", `http://localhost/${PORT}`))