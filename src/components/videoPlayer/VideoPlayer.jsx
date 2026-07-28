import styles from "./videoPlayer.module.css";
import ReactPlayer from "react-player";
import video from "@/assets/st_01.mp4";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useEffect, useState, useRef } from "react";

const VideoPlayer = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const playerRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    const videoPlayed = localStorage.getItem("videoPlayed");

    if (videoPlayed) {
      setShowOverlay(true);
    } else {
      setPlaying(true);
      setVolume(0);
    }
  }, []);

  const handleEnterFullScreen = () => {
    if (playerRef.current) {
      playerRef.current.wrapper.requestFullscreen();
    }
  };

  const handleTogglePlay = () => {
    setPlaying(!playing);
  };

  const handleVideoClick = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      console.log("re-start the video");
      setVolume(0.8);
    }
    setPlaying(true);
    setShowOverlay(false);
    localStorage.setItem("videoPlayed", "true");
  };
  return (
    <div className={styles.videoContainer}>
      {showOverlay && (
        <div className={styles.videoOverlay} onClick={handleVideoClick}>
          {/* Aquí puedes agregar el texto o imagen del cartel */}
          Your video has already started - Click to listen
        </div>
      )}
      <ReactPlayer
        ref={playerRef}
        url={video}
        playing={playing}
        volume={volume}
        onBufferEnd={() => setPlaying(true)}
        controls={false}
        height="100%"
        width="100%"
        onEnded={() => setPlaying(true)} // Cuando el video termina, borra el localStorage
      />
      <div className={styles.customControls}>
        <button onClick={handleTogglePlay}>
          {playing ? (
            <PauseIcon fontSize="large" />
          ) : (
            <PlayArrowIcon fontSize="large" />
          )}
        </button>
        <button onClick={handleEnterFullScreen}>
          <FullscreenIcon fontSize="large" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
