import './App.css';
import React, { useState } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gifUrl, setGifUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Function to capture a selfie using the device's camera
  const handleSelfieCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL("image/png");
      setSelectedImage(dataUrl);
      
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };

  // Function to generate GIF using an API
  const generateGif = async () => {
    setLoading(true);
    try {
      // Example API call to your Node.js backend
      const response = await fetch('/api/generate-gif', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: selectedImage }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setGifUrl(data.gifUrl);  // Set the URL of the generated GIF
    } catch (error) {
      console.error("Error generating GIF:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to download the generated GIF
  const downloadGif = () => {
    const link = document.createElement("a");
    link.href = gifUrl;
    link.download = "live-portrait.gif";
    link.click();
  };

  return (
    <div className="app-container">
      <h1>Real-Time GIF Generator</h1>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      <button onClick={handleSelfieCapture}>Capture Selfie</button>

      {selectedImage && (
        <div className="image-preview">
          <img src={selectedImage} alt="Selected" />
          <button onClick={generateGif}>Generate GIF</button>
        </div>
      )}

      {loading && <p>Generating GIF...</p>}

      {gifUrl && (
        <div className="gif-preview">
          <img src={gifUrl} alt="Generated GIF" />
          <button onClick={downloadGif}>Download GIF</button>
        </div>
      )}
    </div>
  );
}

export default App;
