const commentsmodel = require('../models/commentsmodel');



async function addComment(req,res){
    try{
        const userId=req.user.id;
        const songId=req.params.id;
        const {comment}=req.body;
        if(!comment){
            return res.status(400).json({error:"Comment is required"});
        }
        const newComment = await commentsmodel.create({
            user: userId,
            song: songId,
            comment: comment
        });
        res.status(201).json({message:"Comment added successfully", comment: newComment});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//get all comments of a song
async function getComments(req,res){
    try{
        const songId=req.params.id;
        if(!songId){
            return res.status(400).json({error:"Song ID is required"});
        }
        const comments = await commentsmodel.find({ song: songId }).populate('user', 'name email');
        res.status(200).json({message:"Comments retrieved successfully", comments: comments});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


//delete a comment
async function deleteComment(req,res){
    try{
        const commentId=req.params.id;
        const userId=req.user.id;
        if(!commentId){
            return res.status(400).json({error:"Comment ID is required"});  
        }
        if(!userId){
            return res.status(400).json({error:"User ID is required"});  
        }
        const comment = await commentsmodel.findById(commentId);
        if(!comment){
            return res.status(404).json({error:"Comment not found"});
        }   
        if(comment.user.toString() !== userId){
            return res.status(403).json({error:"You are not the owner of this comment"});
        }
        await commentsmodel.findByIdAndDelete(commentId);
        res.status(200).json({message:"Comment deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//update a comment
async function updateComment(req,res){
    try{
        const commentId=req.params.id;
        const userId=req.user.id;
        const {comment}=req.body;
        if(!commentId){
            return res.status(400).json({error:"Comment ID is required"});
        }
        if(!userId){
            return res.status(400).json({error:"User ID is required"});
        }
        if(!comment){
            return res.status(400).json({error:"Comment is required"});
        }
        const existingComment = await commentsmodel.findById(commentId);
        if(!existingComment){
            return res.status(404).json({error:"Comment not found"});
        }
        if(existingComment.user.toString() !== userId){
            return res.status(403).json({error:"You are not the owner of this comment"});
        }
        const updatedComment = await commentsmodel.findByIdAndUpdate(commentId, { comment: comment }, { new: true });
        res.status(200).json({message:"Comment updated successfully", comment: updatedComment});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports={
    addComment,
    getComments,
    deleteComment,
    updateComment
}