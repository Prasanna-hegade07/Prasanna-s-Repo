import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Viewsongs.css";

function ViewSongs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/Viewsongs");
      setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/delete-song/${id}`);
      alert("Song Deleted");
      fetchSongs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const updateSong = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/edit-song/${selectedSong._id}`,
        selectedSong
      );

      alert("Song Updated");
      setShowModal(false);
      fetchSongs();

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="viewsong-container">

      <h2>All Songs</h2>

      <table>

        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Category</th>
            <th>Image</th>
            <th>Audio</th>
            <th>Action</th>
            
          </tr>
        </thead>

        <tbody>

          {songs.map((song) => (
            <tr key={song._id}>

              <td>{song.title}</td>

              <td>{song.artist?.name}</td>
              <td>{song.category}</td>
              <td>{song.image && <img src={`http://localhost:5000/uploads/${song.image}`} className="vimg" alt={song} />}</td>
              <td>{song.audio && <audio controls src={`http://localhost:5000/uploads/${song.audio}`} className="vaudio" />}</td>

              <td>
                <div className="action-btn">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-song/${song._id}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(song._id)}
                >
                  Delete
                </button>
                </div>
              </td>

            </tr>
          ))}

        </tbody>

      </table>


      {showModal && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>Edit Song</h3>

            <input
              type="text"
              value={selectedSong.title}
              onChange={(e) =>
                setSelectedSong({
                  ...selectedSong,
                  title: e.target.value
                })
              }
            />

            <input
              type="text"
              value={selectedSong.artist}
              onChange={(e) =>
                setSelectedSong({
                  ...selectedSong,
                  artist: e.target.value
                })
              }
            />

            <button onClick={updateSong}>Update</button>

            <button onClick={() => setShowModal(false)}>
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default ViewSongs;