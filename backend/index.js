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
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use('/api/v1/ai', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});