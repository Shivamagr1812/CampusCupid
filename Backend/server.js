require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const user=require("./routes/user");
const result=require("./routes/result");

app.use(express.json());

//connect to db
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`connected to db & listening to the port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(err);
})

app.get("/",(req,res)=>res.send("aditya"));
app.use('/user',user);
app.use("/result",result);
