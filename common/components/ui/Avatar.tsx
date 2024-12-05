import { useEffect, useRef } from "react";

import { useGLTF } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { Euler } from "three";

interface AvatarProps {
  url: string;
  blendshapes: any[];
  rotation: Euler | null;
  gesturesAndMotionData: { rotation: Euler; blendshapes: any[] }[];
  mouthMovementData: { rotation: Euler; blendshapes: any[] }[];
}
function Avatar({
  url,
  blendshapes,
  rotation,
  gesturesAndMotionData,
  mouthMovementData,
}: AvatarProps) {
  const { scene } = useGLTF(url);
  const { nodes } = useGraph(scene);
  const headMesh = useRef<any[]>([]);

  useEffect(() => {
    if (nodes.Wolf3D_Head) headMesh.current.push(nodes.Wolf3D_Head);
    if (nodes.Wolf3D_Teeth) headMesh.current.push(nodes.Wolf3D_Teeth);
    if (nodes.Wolf3D_Beard) headMesh.current.push(nodes.Wolf3D_Beard);
    if (nodes.Wolf3D_Avatar) headMesh.current.push(nodes.Wolf3D_Avatar);
    if (nodes.Wolf3D_Head_Custom)
      headMesh.current.push(nodes.Wolf3D_Head_Custom);
  }, [nodes, url]);

  useFrame(() => {
    if (blendshapes.length > 0 && rotation) {
      // Ensure rotation is a valid Euler object
      const validRotation =
        rotation instanceof Euler
          ? rotation
          : new Euler(
            (rotation as any)._x ,
            (rotation as any)._y ,
            (rotation as any)._z,
            (rotation as any)._order
          );

      gesturesAndMotionData.push({
        rotation: validRotation.clone(),
        blendshapes: [
          ...blendshapes.filter((bs) => !bs.categoryName.startsWith("mouth")),
        ],
      });

      mouthMovementData.push({
        rotation: validRotation.clone(),
        blendshapes: [
          ...blendshapes.filter((bs) => bs.categoryName.startsWith("mouth")),
        ],
      });

      // Apply blendshapes to the head mesh
      blendshapes.forEach((element) => {
        headMesh.current.forEach((mesh) => {
          const index = mesh.morphTargetDictionary[element.categoryName];
          if (index >= 0) {
            mesh.morphTargetInfluences[index] = element.score;
          }
        });
      });

      // Apply rotation to the head, neck, and spine
      if (nodes.Head) {
        nodes.Head.rotation.copy(validRotation);
      }
      if (nodes.Neck) {
        nodes.Neck.rotation.set(
          validRotation.x / 5 + 0.3,
          validRotation.y / 5,
          validRotation.z / 5
        );
      }
      if (nodes.Spine2) {
        nodes.Spine2.rotation.set(
          validRotation.x / 10,
          validRotation.y / 10,
          validRotation.z / 10
        );
      }
    }
  });

  return <primitive object={scene} position={[0, -1.75, 3]} />;
}
export default Avatar;
