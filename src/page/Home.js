import React, { useRef, useEffect, useState } from 'react';
import Canvas from '../compenents/canvas';

const Home = () => {
    const [prediction, setPrediction] = useState(null);

    // Création de la référence "ref" liée à l'élément DOM du canvas
    const canvasRef = useRef(null);

    // Met à jour la référence du canvas dans Home.js
    const updateCanvasRef = (ref) => {
        canvasRef.current = ref;
    };

    return (
        <div className="home">
            <h2>Digit Recognition</h2>
            <Canvas updateCanvasRef={updateCanvasRef} setPrediction={setPrediction} />
            <div className="prediction_result">
                <h2 id="prediction_heading">Prediction</h2>
                {prediction !== null && (
                    <>
                        <h1 id="result">{prediction.index}</h1>
                        <p id="confidence">Confidence: {prediction.confidence}%</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
