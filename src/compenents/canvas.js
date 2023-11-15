import React, { useRef, useEffect, useState } from 'react';


const Canvas = () => {


    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 250; // Ajustez la largeur du canvas selon vos besoins
        canvas.height = 250; // Ajustez la hauteur du canvas selon vos besoins

        const context = canvas.getContext('2d');
        context.fillStyle = 'black'; // Fond noir
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.lineCap = 'round';
        context.strokeStyle = 'white'; // Couleur du stylo blanche
        context.lineWidth = 5;

        contextRef.current = context;
    }, []);

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

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Réinitialise le canvas avec fond noir
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Assure que le contexte est à jour avec le fond noir
        contextRef.current.fillStyle = 'black';
        contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
    };

    const saveDrawing = async () => {
        const canvas = canvasRef.current;
        const drawingData = canvas.toDataURL(); // Convertit le dessin en une URL de données

        // Créer une image en JavaScript
        const image = new Image();
        image.src = drawingData;

        // Attendre que l'image soit chargée
        image.onload = async () => {
            const canvasForModel = document.createElement('canvas');
            const contextForModel = canvasForModel.getContext('2d');

            // Redimensionner l'image à la taille attendue (28x28)
            canvasForModel.width = 28;
            canvasForModel.height = 28;
            contextForModel.drawImage(image, 0, 0, 28, 28);

            // Obtenir les données des pixels
            const imageData = contextForModel.getImageData(0, 0, 28, 28);
            const pixelData = imageData.data;

            // Convertir les valeurs des pixels en une liste
            const pixelValues = [];
            for (let i = 0; i < pixelData.length; i += 4) {
                // La valeur du pixel est la moyenne des composantes rouge, vert et bleu
                const pixelValue = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;
                pixelValues.push(pixelValue);
            }

            // Envoyer les données au backend
            try {
                const response = await fetch('http://localhost:4000/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pixels: pixelValues }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Dessin enregistré avec succès :', data);
            } catch (error) {
                console.error('Erreur lors de l enregistrement du dessin :', error);
            }
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