const express = require("express")
const { Server } = require("socket.io")
const { createServer } = require("http")
const cors = require("cors")
const kafkaClient = require("./kafka_client")
const initAdmin = require("./kafka_admin")
const trigger_producer = require("./kafka_prods")
const User = require("./models/User")
require("dotenv").config()

// Global error handlers to prevent the process from crashing unexpectedly
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

//@anik added
const connectDB = require('./config/db');
const analysisRoutes = require('./routes/analysisRoutes');

const PORT = process.env.PORT || 3000


const app = express()
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000"
}))

const httpServer = createServer(app)
// socket server creation
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
    }
})

// kafka consumer
const kafkaConsumerService = async () => {
    try {
        const consumer = await kafkaClient.consumer({ groupId: "temp" })
        console.log("Connecting Consumer")
        await consumer.connect()
        console.log("connected Consumer")

        console.log("Consumer Subscribing topic")
        await consumer.subscribe({ topics: ['daily_crop_treatment'], fromBeginning: true }) // start from the beginning of the topic
        console.log("Consumer Subscribed ['daily_crop_treatment']")


        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                try {
                    console.log(`Consumed from ${topic} | 
                        message: ${message.value.toString()}`)

                    const data = JSON.parse(message.value.toString())
                    const { longitude, latitude, advice } = data
                    // find users by exact lat/lon (await the query)
                    const users = await User.find({ lat: latitude, lon: longitude })
                    console.log(`lat: ${latitude}, lon: ${longitude}, adv: ${advice}`)
                
                    if (!users || users.length === 0) return
                    for (const user of users) {
                        user.advices.push({
                            date: new Date(),
                            message: advice
                        })
                        await user.save()
                    }
                } catch (e) {
                    console.error('Error processing message:', e.message)
                }
            }
        })
    } catch (err) {
        console.error('Kafka consumer error:', err.message)
        // retry after delay without crashing the entire server
        setTimeout(() => {
            console.log('Retrying kafka consumer...')
            kafkaConsumerService()
        }, 10000)
    }
}

// initAdmin()
// trigger_producer()
kafkaConsumerService()

//@anik added
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Connect Database
connectDB();

// Routes
app.use('/api/analysis', analysisRoutes);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.get('/', (req, res) => {
    return res.send("Hello from server")
})

httpServer.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or set PORT to a different value.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

httpServer.listen(PORT, () => console.log("Server is running on ", `http://localhost/${PORT}`))