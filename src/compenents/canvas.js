import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const Canvas = ({ updateCanvasRef, setPrediction }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [prediction, setLocalPrediction] = useState(null); // Utiliser un seul état pour la prédiction
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [lineWidth, setLineWidth] = useState(15);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 250;
        canvas.height = 250;

        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.lineCap = 'round';
        context.strokeStyle = 'white';
        context.lineWidth = 5;

        contextRef.current = context;

        contextRef.current.lineWidth = lineWidth; // 

        // Met à jour la référence du canvas dans le composant parent (Home)
        updateCanvasRef(canvasRef.current);
    }, [updateCanvasRef]);

    const startDrawing = ({ nativeEvent }) => {
        if (!isDrawing) {
            const { offsetX, offsetY } = nativeEvent;
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            setIsDrawing(true);
        }
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const endDrawing = () => {
        if (isDrawing) {
            contextRef.current.closePath();
            setIsDrawing(false);
        }
    };

    const displayLabel = (data) => {
        let max = data[0];
        let maxIndex = 0;

        console.log(data);

        for (let i = 1; i < data.length; i++) {
            if (data[i] > max) {
                maxIndex = i;
                max = data[i];
            }
        }

        // Mettre à jour la prédiction dans le composant parent (Home)
        setPrediction({
            index: maxIndex,
            confidence: (max * 100).toFixed(2),
        });

        // Mettre à jour la prédiction dans l'état local du composant Canvas
        setLocalPrediction({
            index: maxIndex,
            confidence: (max * 100).toFixed(2),
        });
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        contextRef.current.fillStyle = 'black';
        contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
    };

    const ImageTransmission = (image) => {
        let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([28, 28]).mean(2).expandDims(2).expandDims().toFloat();
        return tensor.div(255.0);
    }

    const Prediction = async (image) => {
        let tensor = ImageTransmission(image);

        try {
            let model = await tf.loadLayersModel('http://localhost:4000/predict/model.json');
            const predictions = await model.predict(tensor).data();

            // Libérer les ressources du modèle après la prédiction
            model.dispose();

            displayLabel(predictions);
        } catch (error) {
            console.error('Erreur lors de la prédiction :', error);
        }
    }

    const saveDrawing = async () => {
        const canvas = canvasRef.current;
        const drawingData = canvas.toDataURL();

        const image = new Image();
        image.src = drawingData;

        image.onload = async () => {
            const canvasForModel = document.createElement('canvas');
            const contextForModel = canvasForModel.getContext('2d');
            canvasForModel.width = 28;
            canvasForModel.height = 28;
            contextForModel.drawImage(image, 0, 0, 28, 28);

            const imageData = contextForModel.getImageData(0, 0, 28, 28);
            const pixelData = imageData.data;

            const pixelValues = [];
            for (let i = 0; i < pixelData.length; i += 4) {
                const pixelValue = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
                pixelValues.push(pixelValue);
            }

            try {
                const response = await fetch('http://localhost:4000/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pixels: pixelValues,
                        // prediction: prediction.index, // Utiliser la prédiction locale
                        prediction: prediction ? prediction.index : null,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Dessin enregistré avec succès :', data);
            } catch (error) {
                console.error('Erreur lors de l enregistrement du dessin :', error);
            }

            Prediction(canvas);
        };
    }

    return (
        <div className="marker">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
            />
            <div className="button">
                <button onClick={saveDrawing}>Predict</button>
                <button onClick={clearCanvas}>Clear</button>
            </div>
        </div>
    );
}

export default Canvas;
