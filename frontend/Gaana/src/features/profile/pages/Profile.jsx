import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../../../app/context/Authcontext";
import SongCard from "../../discovery/components/SongCard";
import {
    getUserProfile,
    getUserSongs,
    updateUserProfile
} from "../service/profile.api";
import "../../discovery/style/Discovery.scss";
import "../style/profile.scss";

const getUserId = (user) => user?._id || user?.id;

function Profile() {
    const { id } = useParams();
    const { user: loggedInUser, getCurrentUser } = useAuthContext();
    const navigate = useNavigate();
    const isOwnProfile = Boolean(loggedInUser && getUserId(loggedInUser) === id);
    const [profile, setProfile] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError(null);
                const [profileData, userSongs] = await Promise.all([
                    getUserProfile(id),
                    getUserSongs(id)
                ]);
                setProfile(profileData);
                setForm({
                    username: profileData.username || "",
                    email: profileData.email || "",
                    bio: profileData.bio || "",
                    profilePicture: profileData.profilePicture || ""
                });
                setSongs(userSongs);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [id]);

    const handleSave = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError(null);
            const updatedProfile = await updateUserProfile(form);
            setProfile(updatedProfile);
            setForm({
                username: updatedProfile.username || "",
                email: updatedProfile.email || "",
                bio: updatedProfile.bio || "",
                profilePicture: updatedProfile.profilePicture || ""
            });
            setIsEditing(false);
            await getCurrentUser();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleSongUpdated = (updatedSong) => {
        setSongs((currentSongs) =>
            currentSongs.map((song) =>
                song._id === updatedSong._id ? updatedSong : song
            )
        );
    };

    const handleSongDeleted = (songId) => {
        setSongs((currentSongs) =>
            currentSongs.filter((song) => song._id !== songId)
        );
    };

    if (loading) {
        return <main className="profile-page"><h2>Loading profile...</h2></main>;
    }

    if (error && !profile) {
        return <main className="profile-page"><h2>{error}</h2></main>;
    }

    return (
        <main className="profile-page">
            <button type="button" className="profile-back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <section className="profile-header-card">
                <div className="profile-avatar">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt={`${profile.username}'s profile`} />
                    ) : (
                        profile.username?.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="profile-summary">
                    <p className="profile-eyebrow">Profile</p>
                    <h1>{profile.username}</h1>
                    <p>{profile.bio || "No bio yet."}</p>
                    <span>{songs.length} {songs.length === 1 ? "song" : "songs"} uploaded</span>
                </div>
                {isOwnProfile && !isEditing && (
                    <button
                        type="button"
                        className="profile-edit-button"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit profile
                    </button>
                )}
            </section>

            {isOwnProfile && isEditing && (
                <form className="profile-edit-form" onSubmit={handleSave}>
                    <h2>Update your profile</h2>
                    <label>
                        Username
                        <input
                            value={form.username}
                            onChange={(event) => setForm({ ...form, username: event.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Email
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm({ ...form, email: event.target.value })}
                            required
                        />
                    </label>
                    <label>
                        Bio
                        <textarea
                            value={form.bio}
                            onChange={(event) => setForm({ ...form, bio: event.target.value })}
                            maxLength={160}
                            rows={3}
                        />
                    </label>
                    <label>
                        Profile picture URL
                        <input
                            type="url"
                            value={form.profilePicture}
                            onChange={(event) => setForm({ ...form, profilePicture: event.target.value })}
                            placeholder="https://example.com/profile.jpg"
                        />
                    </label>
                    {error && <p className="profile-error">{error}</p>}
                    <div className="profile-edit-actions">
                        <button type="button" onClick={() => setIsEditing(false)} disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            )}

            <section className="profile-songs-section">
                <h2>{isOwnProfile ? "Your songs" : `${profile.username}'s songs`}</h2>
                {songs.length === 0 ? (
                    <p className="profile-empty-state">No songs uploaded yet.</p>
                ) : (
                    <div className="song-grid">
                        {songs.map((song) => (
                            <SongCard
                                key={song._id}
                                song={song}
                                songs={songs}
                                title={song.title}
                                artist={song.artist}
                                image={song.cover}
                                audio={song.audio}
                                onSongUpdated={handleSongUpdated}
                                onSongDeleted={handleSongDeleted}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Profile;
