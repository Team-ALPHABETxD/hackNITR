const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")
const kafkaClient = require("./kafka_client")
const initAdmin = require("./kafka_admin")
const trigger_producer = require("./kafka_prods")
const User = require("./models/User")
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
    const consumer = await kafkaClient.consumer({ groupId: "temp" })
    console.log("Connecting Consumer")
    await consumer.connect()
    console.log("connected Consumer")

    console.log("Consumer Subscribing topic")
    await consumer.subscribe({ topics: ['daily_crop_treatment'], fromBeginning: true }) // start from the beginning of the topic
    console.log("Consumer Subscribed ['daily_crop_treatment']")


    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            console.log(`Consumed from ${topic} | 
                message: ${message.value.toString()}`)

            const data = JSON.parse(message.value.toString())
            const { longitude, latitude, advice } = data
            const users = User.find({ lat: latitude, lon: longitude })
            console.log(`lat: ${longitude}, lon: ${latitude}, adv: ${advice}`)
        
            if(!users) return
            for (const user of users) {
                user.advices.push({
                    date: new Date(),
                    message: advice
                })
                await user.save()
            }

        }
    })
}

// initAdmin()
// trigger_producer()
kafkaConsumerService()

app.get('/', (req, res) => {
    return res.send("Hello from server")
})

httpServer.listen(PORT, () => console.log("Server is running on ", `http://localhost/${PORT}`))