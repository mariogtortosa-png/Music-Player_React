import { useState } from "react";
import { useMusic } from "../contexts/MusicContext";

export const Playlists = () => {
  const {
    playlists,
    createPlaylist,
    allSongs,
    addSongToPlaylist,
    currentTrackIndex,
    handlePlaySong,
    deletePlaylist,
  } = useMusic();

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = allSongs.filter((song) => {
    const matches =
      song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());

    const isAlreadyInPlaylist = selectedPlaylist?.songs.some(
      (playlistSong) => playlistSong.id === song.id,
    );

    return matches && !isAlreadyInPlaylist;
  });

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  const handleAddSong = (song) => {
    if (selectedPlaylist) {
      addSongToPlaylist(selectedPlaylist.id, song);
      setSearchQuery("");
      setShowDropdown(false);
    }
  };

  const handlePlayingFromPlaylist = (song) => {
    const globalIndex = allSongs.findIndex((s) => s.id === song.id);
    handlePlaySong(song, globalIndex);
  };

  const deletePlaylistConfirmation = (playlist) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres borrar "${playlist.name}" de tus playlists?`,
      )
    ) {
      deletePlaylist(playlist.id);
    }
  };

  return (
    <div className="playlists">
      <h2>Playlists</h2>

      <div className="create-playlist">
        <h3>Crear nueva playlist</h3>
        <div className="playlist-form">
          <input
            type="text"
            placeholder="Nombre de la playlist"
            className="playlist-input"
            onChange={(e) => setNewPlaylistName(e.target.value)}
            value={newPlaylistName}
          />
          <button className="create-btn" onClick={handleCreatePlaylist}>
            Crear
          </button>
        </div>
      </div>

      <div className="playlists-list">
        {playlists.length === 0 ? (
          <p className="empty-message">No tienes playlists todavía</p>
        ) : (
          playlists.map((playlist, key) => (
            <div className="playlist-item" key={key}>
              <div className="playlist-header">
                <h3>{playlist.name}</h3>
                <div className="playlist-actions">
                  <button
                    className="delete-playlist-btn"
                    onClick={() => deletePlaylistConfirmation(playlist)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
              <div className="add-song-section">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="song-search-input"
                    value={
                      selectedPlaylist?.id === playlist.id ? searchQuery : ""
                    }
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedPlaylist(playlist);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                    onFocus={(e) => {
                      setSelectedPlaylist(playlist);
                      setShowDropdown(e.target.value.length > 0);
                    }}
                  />

                  {selectedPlaylist?.id === playlist.id && showDropdown && (
                    <div className="song-dropdown">
                      {filtered.length === 0 ? (
                        <p className="dropdown-item no-results">
                          No se encontraron canciones
                        </p>
                      ) : (
                        filtered.slice(0, 5).map((song, key) => (
                          <div
                            key={key}
                            className="dropdown-item"
                            onClick={() => handleAddSong(song)}
                          >
                            <span className="song-title">{song.name}</span>
                            <span className="song-artist">{song.artist}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="playlist-songs">
                {playlist.songs.length === 0 ? (
                  <p className="empty-playlist">
                    No hay canciones en la playlist
                  </p>
                ) : (
                  playlist.songs.map((song, key) => (
                    <div
                      key={key}
                      className={`playlist-song ${currentTrackIndex === allSongs.findIndex((s) => s.id === song.id) ? "active" : ""}`}
                      onClick={() =>
                        handlePlayingFromPlaylist(song, playlist.id, key)
                      }
                    >
                      <div className="song-info">
                        <span className="song-title">{song.name}</span>
                        <span className="song-artist">{song.artist}</span>
                      </div>
                      <span className="song-duration">{song.duration}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
