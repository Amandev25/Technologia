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
// for evalution of the essay
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
        jwt_token: body.token,
        lanuage:body.ln
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
// data will be the json form all
router.post('/pronountion/send',async(req,res)=>{
  try{
    const body = req.body;
    const response = await axios.post("http://localhost:8000/docs#/default/get_random_words_of_the_day_random_words_get",
      {
        word:body.word
      },
        {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return res.json({message:"sucess",data:response})
  }catch(error){
    console.log("error in that api")
  }
})
router.get('/get-on-define',async(req,res)=>{
  try{
    const response = await axios.get("http://127.0.0.1:8000/docs#/default/get_random_word_breakdown_random_word_get")
    return res.json({message:"sucess",data:response});
  }catch(error){
    console.log(error);
  }
})

module.exports = router;