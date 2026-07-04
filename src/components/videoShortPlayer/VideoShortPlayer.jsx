import styles from "./videoShortPlayer.module.css";
import ReactPlayer from "react-player";
import video from "@/assets/short.mp4";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useEffect, useState, useRef } from "react";

const VideoShortPlayer = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [destinationSlider, setDestinationSlider] = useState(false);
  const [activitySlider, setActivitySlider] = useState(false);
  const playerRef = useRef();
  const destinationRef = useRef();
  const activityRef = useRef();
  const containerRef = useRef();

  const videoAttr = {
    title: "Snowboard - Bariloche",
    destinations: ["Cerro Catedral", "Bariloche", "Río Negro", "Argentina"],
    activities: ["Snowboard"],
  };
  const animationTimeDest = videoAttr.destinations.length * 2;
  const animationTimeAct = videoAttr.activities.length * 2;

  useEffect(() => {
    const videoPlayed = localStorage.getItem("videoPlayed");
    if (videoPlayed) {
      setShowOverlay(true);
    } else {
      setPlaying(true);
      setVolume(0);
    }
  }, []);

  const checkActivityWidth = () => {
    if (activityRef.current && containerRef.current) {
      const slideWidth = activityRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;
      return slideWidth > containerWidth;
    }
  };

  const checkDestinationWidth = () => {
    if (destinationRef.current && containerRef.current) {
      const slideWidth = destinationRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;
      return slideWidth > containerWidth;
    }
  };

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
      setVolume(0.8);
    }
    setPlaying(true);
    setShowOverlay(false);
    localStorage.setItem("videoPlayed", "true");
  };

  return (
    <div className={styles.videoContainerShort}>
      {showOverlay && (
        <div className={styles.videoOverlayShort} onClick={handleVideoClick}>
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
        height={"100%"}
        width={"100%"}
        onReady={() => {
          setActivitySlider(checkActivityWidth());
          setDestinationSlider(checkDestinationWidth());
        }}
      />
      <div className={styles.infoVideo} ref={containerRef}>
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{videoAttr.title}</h1>
        </div>
        <div className={styles.slider}>
          <div
            className={`${activitySlider ? styles.slideTrack : ""}`}
            style={{ animationDuration: `${animationTimeAct}s` }}
          >
            <h2 className={styles.slide} ref={activityRef}>
              {videoAttr.activities.map((activity) => {
                return `${activity} `;
              })}
            </h2>
          </div>
        </div>
        <div className={styles.slider}>
          <div
            className={`${destinationSlider ? styles.slideTrack : ""}`}
            style={{ animationDuration: `${animationTimeDest}s` }}
          >
            <h2 className={styles.slide} ref={destinationRef}>
              {videoAttr.destinations.map((destination) => {
                return ` ${destination}  -`;
              })}
            </h2>
          </div>
        </div>
      </div>
      <div className={styles.customControlsShort}>
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

export default VideoShortPlayer;
