import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSong from "../hooks/useSong";
import "../style/Add_Song.scss";

function Addsong() {

    const navigate = useNavigate();

    const { addSong, loading, error } = useSong();

    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        duration: ""
    });

    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setAudioFile(e.target.files[0]);
    };

    const handleCoverChange = (e) => {
    setCoverFile(e.target.files[0]);
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!audioFile) {
            alert("Please select an audio file");
            return;
        }

        const data = new FormData();

        data.append("title", formData.title);
        data.append("artist", formData.artist);
        data.append("duration", formData.duration);
        data.append("cover", coverFile);

        // Backend me upload.single("file") hai
        data.append("file", audioFile);

        try {
            const response = await addSong(data);

            console.log("Song uploaded:", response);

            alert("Song uploaded successfully");

            navigate("/");

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="add-song-page">

            <div className="add-song-container">

                <h1>Add Song</h1>

                <p className="add-song-subtitle">
                    Upload your song to Apna Gaana
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Song Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter song title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Artist</label>

                        <input
                            type="text"
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            placeholder="Enter artist name"
                            required
                        />
                    </div>

                    

                    <div className="form-group">
                        <label>Duration</label>

                        <input
                            type="number"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="Duration in seconds"
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Audio File</label>

                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cover Image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverChange}
                            required
                        />
                    </div>

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload Song"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Addsong;