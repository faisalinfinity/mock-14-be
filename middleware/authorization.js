const jwt=require("jsonwebtoken");
const { userModel } = require("../model/userModel");

const authorization = async (req, res, next) => {
    var token;
    
    if(req.headers.authorization){
        token=req?.headers?.authorization.split(" ")[1];
    }else{
        return res.status(400).send("please pass token in headers")
    }

    if(token==undefined)return res.status(400).send("invalid token")

    try {
        var decoded=jwt.verify(token,"faisal")
        
    } catch (error) {
        res.status(400).send(error.message)
    }

    if(decoded){
        let user=await userModel.find({_id:decoded.userId})

        if(user.length){
            req.body.username=decoded.username;
            req.body.avatar=user[0].avatar
            next()
        }else{
            res.status(404).send("please login first")
        }
    }

};

module.exports={
    authorization
}
