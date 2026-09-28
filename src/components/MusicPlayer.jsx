import { useContext, useEffect, useRef } from "react";
//import { useMusic } from "../hooks/useMusic";
//import { MusicContext } from "../contexts/MusicContext";
import { useMusic } from "../contexts/MusicContext";

export const MusicPlayer = () => {
  const {
    currentTrack,
    handlePlaySong,
    currentTime,
    formatTime,
    duration,
    setDuration,
    setCurrentTime,
    nextTrack,
    prevTrack,
    play,
    pause,
    isPlaying,
    volume,
    setVolume,
  } = useMusic();

  const audioRef = useRef(null);

  const handleTimeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => console.error(err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setDuration, currentTrack, setCurrentTime, nextTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    setDuration(0);
    setCurrentTime(0);
  }, [currentTrack, setCurrentTime, setDuration]);

  const currentPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
        crossOrigin="anonymous"
      />

      <div className="track-info">
        <h3 className="track-title">{currentTrack.name}</h3>
        <p className="track-artist">{currentTrack.artist}</p>
      </div>

      <div className="progress-container">
        <span className="time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || "0"}
          step="0.1"
          value={currentTime || "0"}
          className="progress-bar"
          onChange={handleTimeChange}
          style={{ "--progress": `${currentPercentage}%` }}
        />
        <span className="time">{formatTime(duration)}</span>
      </div>
      <div className="controls">
        <button className="control-btn" onClick={prevTrack}>
          ⏮
        </button>
        <button
          className="control-btn play-btn"
          onClick={() => (isPlaying ? pause() : play())}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="control-btn" onClick={nextTrack}>
          ⏭
        </button>
      </div>
      <div className="volume-container">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          value={volume}
          step="0.01"
          className="volume-bar"
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};
