import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const songs = [
    {
      id: 1,
      name: "Julia",
      artist: "Don West",
      url: "/songs/Don West - Julia.mp3",
      duration: "3:09",
    },
    {
      id: 2,
      name: "La Llum",
      artist: "Enemic Interior",
      url: "/songs/Enemic Interior - La Llum.wav",
      duration: "1:27",
    },
    {
      id: 3,
      name: "How Easy Your Heart Forgets",
      artist: "The HeartStoppers",
      url: "/songs/How Easy Your Heart Forgets.mp3",
      duration: "2:24",
    },
    {
      id: 4,
      name: "A Caballo",
      artist: "Nathy Peluso",
      url: "/songs/Nathy Peluso - A Caballo.mp3",
      duration: "3:17",
    },
    {
      id: 5,
      name: "Volverás a quererme mañana",
      artist: "Perfecto Miserable",
      url: "/songs/Perfecto Miserable - Volverás a quererme mañana.wav",
      duration: "4:28",
    },
    {
      id: 6,
      name: "Holiday",
      artist: "Turnstile",
      url: "/songs/Turnstile - Holiday.mp3",
      duration: "2:52",
    },
  ];

  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
    if (savedPlaylists) {
      const playlists = JSON.parse(savedPlaylists);
      setPlaylists(playlists);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("musicPlayerPlaylists");
    }
  }, [playlists]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name: name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      }),
    );
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId),
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  const handlePlaySong = (song, index) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <MusicContext.Provider
      value={{
        allSongs,
        handlePlaySong,
        currentTrackIndex,
        deletePlaylist,
        currentTrack,
        currentTime,
        setCurrentTime,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        createPlaylist,
        playlists,
        addSongToPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);
  if (!contextValue) {
    throw new Error("useMusic tiene que estar dentro del MusicProvider");
  }
  return contextValue;
};
