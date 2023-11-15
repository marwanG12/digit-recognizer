import React, { useRef, useEffect, useState } from 'react';
import Canvas from '../compenents/canvas'; 
const Home = () => {
  // Création de la référence "ref" lié a l'élément DOM du canvas
  const canvasRef = useRef(null)
 
  // Met à jour la référence du canvas dans Home.js
  const updateCanvasRef = (ref) => {
    canvasRef.current = ref;
  };
 
  return (
    <div className="home">
      <h2>Digit Recognition</h2>
      <Canvas updateCanvasRef={updateCanvasRef} />
      <div className="prediction_result">
        <h2 id="prediction_heading">Prediction</h2>
        <h1 id="result">-</h1>
        <p id="confidence">Confidence: -</p>
      </div>
    </div>
  );
};
 
export default Home;