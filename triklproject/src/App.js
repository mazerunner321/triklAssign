import logo from "./logo.svg";
import "./App.css";
import { useState, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";

function App() {
  const [imageData, setImageData] = useState(null);
  const [text, setText] = useState("");
  const [textOverlays, setTextOverlays] = useState([]);
  const imageRef = useRef(null);

  const fetchImageFromUnsplash = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random`,
        {
          params: {
            client_id: process.env.REACT_APP_UNSPLASH_API_KEY,
          },
        }
      );

      // console.log(response.data);
      setImageData(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddText = () => {
    if (text.trim() !== "") {
      setTextOverlays([
        ...textOverlays,
        {
          text,
          position: { x: 5, y: 5 },
          size: { width: 150, height: 50 },
        },
      ]);
      setText("");
    }
  };

  return (
    <div className="App">
      <button id="generateBtn" onClick={fetchImageFromUnsplash}>
        Generate Random Image
      </button>
      <br />

      {/* Entering Text */}
      <input
        type="text"
        placeholder="Enter Text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button id="addtextBtn" onClick={handleAddText}>
        Add Text
      </button>
      <br />

      <div className="image-container" ref={imageRef}>
        {imageData && <img src={imageData.urls.regular} alt="randomImage" />}
        {textOverlays.map((overlay, i) => (
          <Draggable key={i} bounds="parent" defaultPosition={overlay.position}>
            <ResizableBox
              width={overlay.size.width}
              height={overlay.size.height}
              onResizeStop={(e, data) => {
                const newSize = {
                  width: data.size.width,
                  height: data.size.height,
                };
                const newOverlays = [...textOverlays];
                newOverlays[i].size = newSize;
                setTextOverlays(newOverlays);
              }}
            >
              <div className="text-overlay">{overlay.text}</div>
            </ResizableBox>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default App;
