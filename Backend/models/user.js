const {Schema,model }=require("mongoose");
const {createHmac,randomBytes}=require("crypto");
const {createToken,verifyToken}=require("../authentication/jwt");
const userSchema=new Schema({
    "name":{
        type: String,
        required : true
    },
    
    "gender":{
        enum:["male","female"]
    },

    "email":{
        type:String,
        required:true,
        unique:true
    },

    "salt":{
        type:String
    },
    
    "password":{
        type:String,
        required:true
    },

    "dp":{
        type:String,
        required: true
    },

    "program":{
        enum:["btech","mtech","phd"]
    },

    "year":{
        enum:["1","2","3","4","5"]
    },

    "interest":[
        {type :String}
    ],

    "bio":{
        type:String,
        required:true
    },

    "publicKey":{
        type:Number,
        required:true
    },

    "privateKey":{
        type:String,
        required:true
    },

    "crushes":[
        {type:Number},
    ],

    "matches":[
        {type:String}
    ]
});

userSchema.pre("save",function (next){
    const user=this;
    if(!user.isModified("password"))return;
    const Token =createToken(this.password,this.privateKey);
    this.privateKey=Token;
    const salt=process.env.SECRET
    const hashedpassword=createHmac('sha256',salt).update(user.password).digest("hex");
    this.salt=salt;
    this.password=hashedpassword;
    next();
});

const User=model("user",userSchema);
module.exports=User;
