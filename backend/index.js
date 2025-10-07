const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config(); 
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
})
.then(() => console.log('MongoDB Atlas Connected'))
.catch(err => console.error('MongoDB Atlas Connection Error:', err));
app.use(express.json());
const PORT = 3000;
app.use('api/v1/ai')
app.listen(PORT , (req , res)=>{
    console.log("server is running")
})