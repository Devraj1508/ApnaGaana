const usermodel = require("../models/usermodel");


async function getUserProfile(req, res) {
    try {
        const userId = req.params.id;
        const user = await usermodel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
}

//update user profile
async function updateUserProfile(req,res){
    try{
        const userId=req.user.id;
        const {username,email}=req.body;
        const user=await usermodel.findByIdAndUpdate(userId,{username,email},{new:true}).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user profile", error });
    }
}

module.exports={ getUserProfile, updateUserProfile };