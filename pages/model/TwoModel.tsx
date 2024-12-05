import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Euler, Color } from 'three';
import Avatar from '@/common/components/ui/Avatar'; // Avatar component from earlier
import io from 'socket.io-client';
import VideoFeed from '@/common/components/ui/VideoFeed'; // Same as before, for capturing camera data
import Chat from '@/modules/room/components/chat/Chat';

const socket = io();

function TwoModels({ roomId, onClick }: { roomId: any, onClick: any }) {
  const [blendshapes, setBlendshapes] = useState<any[]>([]);
  const [rotation, setRotation] = useState<Euler>(new Euler());
  const [remoteBlendshapes, setRemoteBlendshapes] = useState<any[]>([]);
  const [remoteRotation, setRemoteRotation] = useState<Euler>(new Euler());
  const headMesh: any[] = [];
  const [showChat, setShowChat] = useState(false);


  useEffect(() => {
    console.log(roomId, 'joinRoom');
    socket.emit("joinRoom", roomId);
  }, [roomId]);
  // Send the camera data via socket
  useEffect(() => {
    if (blendshapes.length > 0) {
      socket.emit("modelData", { roomId, blendshapes, rotation });
    }
  }, [blendshapes, rotation]);

  // Listen for remote data via socket
  useEffect(() => {
    socket.on("updateModel", (data: { blendshapes: any[], rotation: Euler }) => {
      setRemoteBlendshapes(data.blendshapes);
      setRemoteRotation(data.rotation);
    });
  }, []);

  // const handleNextClick = () => {
  //   console.log(roomId, 'leave');
  //   socket.emit("leaveRoom", roomId);
  //   socket.on("user_leave", (roomId) => {
  //     console.log(roomId, "soket disconnected");
  //     onNextClick();
  //   })

  // }

  return (



    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-200 to-white p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Avatar Video Call</h1>

      <div className="flex flex-col lg:flex-row gap-6 flex-grow">
        {/* Main video screens */}
        <div className="flex-grow flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-yellow-100 to-white shadow-xl rounded-xl">
          {/* Your video */}
          <div className="flex-1 aspect-video bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg overflow-hidden relative shadow-md">
            <div className="w-full h-full  object-cover ">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full iphone-se:h-[200px]" >

                <Canvas
                  className="w-full h-full"
                  camera={{ fov: 25 }}
                  shadows
                >
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
                  <pointLight
                    position={[0, 0, 10]}
                    intensity={0.5}
                    castShadow
                  />
                  <Avatar url="https://models.readyplayer.me/667c2b910f0bc383f8db6fc8.glb?morphTargets=ARKit&textureAtlas=1024"
                    blendshapes={blendshapes} rotation={rotation} gesturesAndMotionData={[]} mouthMovementData={[]} />
                </Canvas>
              </div>
            </div >
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
              You
            </div>
          </div>

          {/* Their video */}
          <div className="flex-1 aspect-video bg-gradient-to-br from-yellow-400 to-yellow-200 rounded-lg overflow-hidden relative shadow-md">
            <div className="w-full h-full  object-cover ">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full iphone-se:h-[200px] ">
                <Canvas
                  className="w-full h-full"
                  camera={{ fov: 25 }}
                  shadows
                >
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
                  <pointLight
                    position={[0, 0, 10]}
                    intensity={0.5}
                    castShadow
                  />
                  <Avatar url="https://models.readyplayer.me/6694131434432ca7ede8f974.glb?morphTargets=ARKit&textureAtlas=1024"
                    blendshapes={remoteBlendshapes} rotation={remoteRotation} gesturesAndMotionData={[]} mouthMovementData={[]} />
                </Canvas>

                {/* Video feed for capturing camera data */}
                <VideoFeed setBlendshapes={setBlendshapes} setRotation={setRotation} />
              </div>
            </div >
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Them
            </div>
          </div>
        </div>

        {/* Avatar selectors */}
        {/* <div className="p-4 lg:w-auto bg-gradient-to-b from-yellow-100 to-white shadow-xl rounded-xl self-center lg:self-start"> */}
        {/* <h2 className="text-lg font-semibold mb-3 text-black text-center">Change Your Avatar</h2> */}
        {/* </div> */}

        {/* {showChat && (
          <div className="flex justify-left">
          </div>
        )}*/}
      </div> 
        <Chat />

      {/* Call controls */}
      <div className="mt-6 mb-7 flex justify-center space-x-4">
        <button onClick={onClick} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300">
          Next
        </button>
        <button
          className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300"
          onClick={() => setShowChat((prev) => !prev)} // Toggle Chat Visibility
        >
          {showChat ? "Hide Chat" : "Show Chat"} {/* Change button text */}
        </button>
        <button className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300">


          Show Camera
        </button>
      </div>
    </div>
  );
}

export default TwoModels;
