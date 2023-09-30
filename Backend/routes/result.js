const {Router}=require("express");
const routes=Router();
const User=require("../models/user");


routes.get("/",async(req,res)=>{
    const mac=new Map();
    const users=await User.find();

    users.map((user)=>{
    
        user.crushes.map((crush)=>{
            if(!mac.has(crush)){
                mac.set(crush);
                mac[crush]=[];
            }
            mac[crush].push(user._id);
        });
    })
console.log(mac);
    Object.keys(mac).map(async(key)=>{
        if(mac[key].length>1){
        await User.findOneAndUpdate({_id:mac[key][0]},{$push:{matches:mac[key][1]}});
        await User.findOneAndUpdate({_id:mac[key][1]},{$push:{matches:mac[key][0]}});
        }
    });
res.send("helllo");
})
module.exports=routes;