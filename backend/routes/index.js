const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
  const token = jwt.sign(result);
  return res.json({message:"login done " ,data:token},password);
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
    const send_data = await axios(python_url_correect_essay,{
      method: 'POST',
      body:{
        essay:essay,
        token:body.token
      }
    })
    const userid = jwt.decode(body.token,password);
    const data = User.updatedAt({username:userid},{
      reports:reports.push(send_data.context)
    })
    return res.json({data:send_data})
  }catch(e){
console.log("error in the evalution");
return res.json({message:"error in evalution of the error"})
  }
})