const jwt=require('jsonwebtoken');

async function authenticate(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Authentication token is missing"});
    }
     let decoded;
    try{
        decoded=jwt.verify(token,process.env.JWT_SECRET);
    }catch(err){
        return res.status(401).json({message:"Invalid authentication token"});
    }
    req.user=decoded;
    next();
}

module.exports=authenticate;