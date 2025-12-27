# MERN Application - Setup and Configuration

## Project Structure

```
mern-app/
├── backend/
│   ├── models/
│   │   └── CropAnalysis.js        # MongoDB Schema
│   ├── routes/
│   │   └── analysisRoutes.js      # API endpoints
│   ├── middleware/
│   │   └── cors.js                # CORS configuration
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── server.js                  # Express server
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AnalysisList.jsx    # View analyses
    │   │   ├── AnalysisForm.jsx    # Create analysis
    │   │   └── Analytics.jsx       # Dashboard statistics
    │   ├── App.jsx                 # Main app component
    │   ├── App.css                 # Styling
    │   ├── main.jsx                # React entry point
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hacknit-crop-analysis
NODE_ENV=development
CLIENT_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

**Note:** MongoDB URI examples:
- Local: `mongodb://localhost:27017/hacknit-crop-analysis`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/hacknit-crop-analysis?retryWrites=true&w=majority`

### 3. Start Backend Server

```bash
npm start          # Production
npm run dev        # Development (with nodemon)
```

The server will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

## API Endpoints

### POST /api/analysis
Create a new crop analysis
```json
{
  "crop_details": {...},
  "validated": {...},
  "weather_details": {...},
  "disease_details": {...},
  "plan": {...}
}
```

### GET /api/analysis
Get all analyses with optional filtering
- Query params: `crop`, `limit`, `skip`

### GET /api/analysis/:id
Get a specific analysis by ID

### PUT /api/analysis/:id
Update a crop analysis

### DELETE /api/analysis/:id
Delete a crop analysis

### GET /api/analysis/stats/summary
Get summary statistics

## MongoDB Schema

The main collection stores documents with the following structure:

```javascript
{
  crop_details: {
    crop: String,
    lat: Number,
    lon: Number,
    growth: String (enum: ['germination', 'growth', 'flowering', 'fruiting', 'harvest']),
    sowing_date: Date,
    current_date: Date,
    estimated_production: Number,
    storage_availability: String (enum: ['Yes', 'No']),
    disease_detect: Boolean,
    crop_img: String
  },
  validated: {
    flag: Boolean,
    reason: String
  },
  weather_details: {
    temp: Number,
    hum: Number (0-100),
    wind_speed: Number,
    summary: String
  },
  disease_details: {
    NA: Boolean,
    name: String,
    reason: String,
    status: String (enum: ['none', 'present', 'may occur in future', 'occurred in past']),
    spoilage_risk: String (enum: ['Low', 'Medium', 'High']),
    days_to_spoil: Number,
    confidence: Number (0-1)
  },
  plan: {
    decision: String (enum: ['Store', 'Sell', 'Process', 'Discard']),
    reason: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Running the Full Application

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

## Features

✅ Create new crop analysis records
✅ View all analyses with filtering by crop name
✅ View detailed analysis information
✅ Delete analyses
✅ View statistics and analytics
✅ Real-time data updates
✅ Responsive design
✅ RESTful API

## Technologies Used

- **Frontend**: React 18, Vite, CSS3
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ODM
- **HTTP Client**: Fetch API

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB credentials

### CORS Error
- Check `CLIENT_URL` in backend `.env`
- Ensure backend and frontend ports are different

### Port Already in Use
- Change `PORT` in backend `.env`
- Change `port` in frontend `vite.config.js`

## License

MIT
