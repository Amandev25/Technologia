const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/index.js');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
})
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.error('MongoDB Atlas Connection Error:', err));

// Enable CORS for mobile app
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use('/api/v1/ai', routes);

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access from mobile: http://10.0.0.237:${PORT}`);

    // Log API keys status
    const geminiKey = process.env.GEMINI_API_KEY;
    console.log('\n🔑 API Keys Status:');
    console.log(`GEMINI_API_KEY: ${geminiKey ? geminiKey.substring(0, 20) + '...' : '❌ NOT SET'}`);
    console.log(`Quiz will use: ${geminiKey ? geminiKey.substring(0, 20) + '...' : '❌ NOT SET'}\n`);
});