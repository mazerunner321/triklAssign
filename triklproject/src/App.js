import React, { useState, useRef } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "./App.css";

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
          id: Date.now(),
          text,
          position: { x: 50, y: 50 },
          size: { width: 150, height: 50 },
        },
      ]);
      setText("");
    }
  };

  const handleTextChange = (e, id) => {
    const updatedText = e.target.innerText;
    setTextOverlays((prevOverlays) =>
      prevOverlays.map((overlay) =>
        overlay.id === id ? { ...overlay, text: updatedText } : overlay
      )
    );
  };

  return (
    <div className="App">
      <button id="generateBtn" onClick={fetchImageFromUnsplash}>
        Generate Random Image
      </button>
      <br />
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
        {imageData && (
          <img src={imageData.urls.regular} alt="randomImage" width="100%" />
        )}
        {textOverlays.map((overlay) => (
          <Draggable
            key={overlay.id}
            bounds="parent"
            defaultPosition={overlay.position}
          >
            <ResizableBox
              width={overlay.size.width}
              height={overlay.size.height}
              onResize={(e, data) => {
                const newSize = {
                  width: data.size.width,
                  height: data.size.height,
                };
                setTextOverlays((prevOverlays) =>
                  prevOverlays.map((prevOverlay) =>
                    prevOverlay.id === overlay.id
                      ? { ...prevOverlay, size: newSize }
                      : prevOverlay
                  )
                );
              }}
            >
              <div
                className="text-overlay"
                contentEditable
                onBlur={(e) => handleTextChange(e, overlay.id)}
              >
                {overlay.text}
              </div>
            </ResizableBox>
          </Draggable>
        ))}
      </div>
    </div>
  );
}

export default App;
