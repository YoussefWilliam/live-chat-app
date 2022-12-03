import React, { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{ stream: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  return (
    <video
      className="w-full shadow-lg border rounded-lg p-1"
      ref={videoRef}
      autoPlay
      muted={true}
    ></video>
  );
};

export default VideoPlayer;
