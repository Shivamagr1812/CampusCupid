const {Router}=require("express");
const routes=Router();
const {createHmac,randomBytes}=require("crypto");
const User=require("../models/user");
const {createToken,verifyToken}=require("../authentication/jwt");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET,
  });
  
  // File Upload
  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

// multer config

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// login route

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

// get all users

routes.get('/',async(req,res)=>{
    var user=await User.find();
    console.log(user)
    const query=req.query;
    if(query){
        user=User.find({batch:query});
    }
    res.send("hello");
})

// sign in and take profile details from user

routes.post("/signin",upload.single('dp'),async(req,res)=>{
    
    const user=req.body;

    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        console.log(cldRes.url);
        var dp = "";
        dp = cldRes.url;
        user.dp=dp;
        console.log(user);
        await User.create(user);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.send({
        message: error.message,
        });
    }
});

// add a new crush

routes.get('/addCrush/:id',async(req,res)=>{
    
    const user=await User.findOneAndUpdate({_id:req.params.id},{$push:{crushes:req.body}});
    // res.send(user);
    console.log(req.params.id);
    res.send("hello");
})

module.exports=routes;