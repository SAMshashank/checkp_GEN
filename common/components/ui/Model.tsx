import { useState } from "react";

import { Canvas } from "@react-three/fiber";
import { Color, Euler } from "three";

import Avatar from "./Avatar";
import DownloadButton from "./DownloadButton";
import VideoFeed from "./VideoFeed";

function Model() {
  const [url] = useState<string>(
    "https://models.readyplayer.me/667c2b910f0bc383f8db6fc8.glb?morphTargets=ARKit&textureAtlas=1024"
  );
  const [blendshapes, setBlendshapes] = useState<any[]>([]);
  const [rotation, setRotation] = useState<Euler>(new Euler());
  const headMesh: any[] = [];
  const gesturesAndMotionData: { rotation: Euler; blendshapes: any[] }[] = [];
  const mouthMovementData: { rotation: Euler; blendshapes: any[] }[] = [];

  return (
    <div>
      <VideoFeed setBlendshapes={setBlendshapes} setRotation={setRotation} />
      <Canvas style={{ height: 600 }} camera={{ fov: 25 }} shadows>
        <ambientLight intensity={0.5} />
        <pointLight
          position={[10, 10, 10]}
          color={new Color(1, 1, 0)}
          intensity={0.5}
          castShadow
        />
        <pointLight
          position={[-10, 0, 10]}
          color={new Color(1, 0, 0)}
          intensity={0.5}
          castShadow
        />
        <pointLight position={[0, 0, 10]} intensity={0.5} castShadow />
        <Avatar
          url={url}
          blendshapes={blendshapes}
          rotation={rotation}
          headMesh={headMesh}
          gesturesAndMotionData={gesturesAndMotionData}
          mouthMovementData={mouthMovementData}
        />
      </Canvas>
      <DownloadButton
        data={gesturesAndMotionData}
        filename="gestures_and_motion.json"
      />
      <DownloadButton
        data={mouthMovementData}
        filename="mouth_movements.json"
      />
    </div>
  );
}

export default Model;
