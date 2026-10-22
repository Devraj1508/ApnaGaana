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
async function updateUserProfile(req, res){
    try{
        const userId=req.user.id;
        const {username,email,bio,profilePicture}=req.body;
        const updates = {};

        if (username !== undefined) {
            if (typeof username !== "string" || !username.trim()) {
                return res.status(400).json({ message: "Username is required" });
            }
            updates.username = username.trim();
        }
        if (email !== undefined) {
            if (typeof email !== "string" || !email.trim()) {
                return res.status(400).json({ message: "Email is required" });
            }
            updates.email = email.trim();
        }
        if (bio !== undefined) {
            if (typeof bio !== "string") {
                return res.status(400).json({ message: "Bio must be text" });
            }
            updates.bio = bio.trim();
        }
        if (profilePicture !== undefined) {
            if (typeof profilePicture !== "string") {
                return res.status(400).json({ message: "Profile picture must be a URL" });
            }
            updates.profilePicture = profilePicture.trim();
        }

        const user=await usermodel.findByIdAndUpdate(userId,updates,{new:true,runValidators:true}).select("-password");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user profile", error });
    }
}

module.exports={ getUserProfile, updateUserProfile };