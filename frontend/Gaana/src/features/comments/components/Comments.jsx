import { useEffect, useState } from "react";
import { useAuthContext } from "../../../app/context/Authcontext";
import {
    addComment,
    deleteComment,
    getComments,
    updateComment
} from "../service/comments.api";
import "../style/comments.scss";

const getUserId = (user) => (user?._id || user?.id)?.toString();

function Comments({ songId }) {
    const { user: currentUser } = useAuthContext();
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadComments = async () => {
            try {
                setLoading(true);
                setError(null);
                setComments(await getComments(songId));
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load comments");
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [songId]);

    const handleAddComment = async (event) => {
        event.preventDefault();
        if (!commentText.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            const newComment = await addComment(songId, commentText);
            setComments((currentComments) => [newComment, ...currentComments]);
            setCommentText("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!editingText.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            const updatedComment = await updateComment(commentId, editingText);
            setComments((currentComments) =>
                currentComments.map((comment) =>
                    comment._id === commentId ? updatedComment : comment
                )
            );
            setEditingId(null);
            setEditingText("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setSubmitting(true);
            await deleteComment(commentId);
            setComments((currentComments) =>
                currentComments.filter((comment) => comment._id !== commentId)
            );
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="comments-section">
            <h2>Comments</h2>

            {currentUser ? (
                <form className="comment-form" onSubmit={handleAddComment}>
                    <textarea
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Share your thoughts about this song..."
                        maxLength={500}
                        rows={3}
                        aria-label="Add a comment"
                    />
                    <button type="submit" disabled={submitting || !commentText.trim()}>
                        {submitting ? "Posting..." : "Post comment"}
                    </button>
                </form>
            ) : (
                <p className="comments-muted">Log in to leave a comment.</p>
            )}

            {error && <p className="comments-error">{error}</p>}

            {loading ? (
                <p className="comments-muted">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="comments-muted">No comments yet. Be the first to comment.</p>
            ) : (
                <div className="comments-list">
                    {comments.map((comment) => {
                        const isOwner = getUserId(currentUser) === getUserId(comment.user);

                        return (
                            <article className="comment-item" key={comment._id}>
                                <div className="comment-avatar">
                                    {comment.user?.profilePicture ? (
                                        <img src={comment.user.profilePicture} alt="" />
                                    ) : (
                                        comment.user?.username?.charAt(0).toUpperCase() || "?"
                                    )}
                                </div>
                                <div className="comment-content">
                                    <div className="comment-meta">
                                        <strong>{comment.user?.username || "User"}</strong>
                                        {isOwner && <span>You</span>}
                                    </div>
                                    {editingId === comment._id ? (
                                        <div className="comment-edit">
                                            <textarea
                                                value={editingText}
                                                onChange={(event) => setEditingText(event.target.value)}
                                                rows={2}
                                                maxLength={500}
                                            />
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateComment(comment._id)}
                                                    disabled={submitting}
                                                >
                                                    Save
                                                </button>
                                                <button type="button" onClick={() => setEditingId(null)}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>{comment.comment}</p>
                                    )}
                                </div>
                                {isOwner && editingId !== comment._id && (
                                    <div className="comment-actions">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingId(comment._id);
                                                setEditingText(comment.comment);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteComment(comment._id)}
                                            disabled={submitting}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default Comments;
