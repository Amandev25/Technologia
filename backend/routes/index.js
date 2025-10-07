const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../model/User');
// used for the genrating the user id and making the schema for the user in the mongodb
router.use('/',async(req,res)=>{
    try{
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  new User({username:result});
  const token = jwt.sign(result);
  return res.json({message:"login done " ,data:token});
    }catch(error){
        console.log("server error")
    }
})
router.use('/ai/evaluation',async(req,res)=>{
  

})