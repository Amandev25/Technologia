const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const axios = require('axios');
const password = "hello_world";
const User = require('../model/User');
const python_url_correect_essay = "http://localhost:8000/correct-essay";
// used for the genrating the user id and making the schema for the user in the mongodb
router.post('/',async(req,res)=>{
    try{
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const data = new User({username:result});
  await data.save();
  const token = jwt.sign({ username: result }, password);
  return res.json({message:"login done " ,data:token});
    }catch(error){
        console.log("server error")
    } 
})
router.post('/ai/evaluation',async(req,res)=>{
  try{
    const body = req.body;
    if(!body.token){
      return res.json({message:"token is missing"})
    }
    const essay = body.essay;
    const send_data = await axios.post(
      python_url_correect_essay,
      {
        essay,
        jwt_token: body.token
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const userid = jwt.decode(body.token,password);
    return res.json({data:send_data.data, user:userid})
  }catch(e){
console.error("error in the evalution", e?.response?.data || e.message);
return res.status(500).json({message:"error in evaluation", detail: e?.response?.data || e.message})
  }
})

module.exports = router;