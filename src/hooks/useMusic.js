import { useState } from "react";

//LISTA DE LOS ARCHIVOS DE MÚSICA
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

export const useMusic = () => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

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

  return {
    allSongs,
    handlePlaySong,
    currentTrackIndex,
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
  };
};
