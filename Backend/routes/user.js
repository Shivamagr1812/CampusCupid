const {Router}=require("express");
const routes=Router();
const {createHmac,randomBytes}=require("crypto");
const User=require("../models/user");
const {createToken,verifyToken}=require("../authentication/jwt");



routes.post("/signin",async(req,res)=>{
    const user=req.body;
    await User.create(user);
    res.status(200).json(user)
})

routes.post("/login",async(req,res)=>{
    
    var {email,password}=req.body;
    const user=await User.findOne({email});
    const salt=process.env.SECRET;
    const hashedpassword=createHmac('sha256',salt).update(password).digest("hex");
    if(!hashedpassword===user.password)res.send("wrong password");
   
    const privateKey=verifyToken(user.privateKey,password);
    res.json(privateKey);
    // res.send("jello");
})

routes.get('/',async(req,res)=>{
    var user=await User.find();
    console.log(user)
    const query=req.query;
    if(query){
        user=User.find({batch:query});
    }
    res.send("hello");
})


routes.get('/addCrush/:id',async(req,res)=>{
    
    const user=await User.findOneAndUpdate({_id:req.params.id},{$push:{crushes:req.body}});
    // res.send(user);
    console.log(req.params.id);
    res.send("hello");
})
module.exports=routes;