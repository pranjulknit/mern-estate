import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';


export const signup = async (req,res)=>{
  const {username,email,password} = req.body;

  const hashedPassword = bcryptjs.hashSync(password,10);


  try{
    const newuser = new User({username,email,password:hashedPassword});
   await newuser.save();
  }
  catch(err){
    res.status(500).json({error:err.message});
  }

  

   res.status(201).json("user created successfully!");



}