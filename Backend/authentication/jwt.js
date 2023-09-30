const JWT=require("jsonwebtoken");

function createToken( password,privateKey){
    const payload={privateKey}
    const token=JWT.sign(payload,password);
    return token;
}

const verifyToken=(token,password)=>{
    const payload=JWT.verify(token,password);
    return payload;
}
module.exports={createToken,verifyToken};