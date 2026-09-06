const followmodel = require("../models/followmodel");
const usermodel = require("../models/usermodel");


// Follow a user
async function followUser(req, res) {
    try {
        const followerId = req.user.id;
        const followingId = req.params.id;

        // Cannot follow yourself
        if (followerId === followingId) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        // Check user exists
        const user = await usermodel.findById(followingId);

        if (!user) {
            return res.status(404).json({
                message: "User to follow not found"
            });
        }

        // Check already following
        const alreadyFollowing = await followmodel.findOne({
            follower: followerId,
            following: followingId
        });

        if (alreadyFollowing) {
            return res.status(400).json({
                message: "You are already following this user"
            });
        }

        // Create follow
       const follow = await followmodel.create({
            follower: followerId,
            following: followingId
        });

        res.status(201).json({
            message: "User followed successfully",
            follow
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}


// Get all followers of my account
async function getfollowers(req, res) {
    try {
        const userId = req.user.id;

        const followers = await followmodel
            .find({ following: userId })
            .populate("follower", "username profilePicture");

        res.status(200).json(followers);

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


// Get all users that I am following
async function getfollowing(req, res) {
    try {
        const userId = req.user.id;

        const following = await followmodel
            .find({ follower: userId })
            .populate("following", "username profilePicture");

        res.status(200).json(following);

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


// Unfollow a user
async function unfollowUser(req, res) {
    try {
        const followerId = req.user.id;
        const followingId = req.params.id;

        const follow = await followmodel.findOne({
            follower: followerId,
            following: followingId
        });

        if (!follow) {
            return res.status(400).json({
                message: "You are not following this user"
            });
        }

        await followmodel.deleteOne({
            follower: followerId,
            following: followingId
        });

        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    followUser,
    getfollowers,
    getfollowing,
    unfollowUser
};