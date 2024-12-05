import { Euler } from "three";

interface DownloadButtonProps {
  data: { rotation: Euler; blendshapes: any[] }[];
  filename: string;
}

function DownloadButton({ data, filename }: DownloadButtonProps) {
  const downloadData = () => {
    const serializedData = data.map(({ rotation, blendshapes }) => ({
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z,
        order: rotation.order,
      },
      blendshapes,
    }));
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(serializedData)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return <button onClick={downloadData}>Download {filename}</button>;
}

export default DownloadButton;
