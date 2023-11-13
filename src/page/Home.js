import React, { useRef, useEffect, useState } from 'react';

const Home = () => {
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
  
  const Clear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  
    // Réinitialise le canvas avec fond noir
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Assure que le contexte est à jour avec le fond noir
    contextRef.current.fillStyle = 'black';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };
    

  return (
    <div className="home">
      <h2>Digit Recognition</h2> 
        <div className='marker'>
            <canvas
             ref={canvasRef}
             onMouseDown={startDrawing}
             onMouseMove={draw}
             onMouseUp={endDrawing}
             onMouseLeave={endDrawing}
            />
            <div className="button">
                <button>Predict</button>
                <button onClick={Clear}>Clear</button>
            </div>
        </div>
        <div className='prediction_result'>
            <h2 id="prediction_heading">Prediction</h2>
            <h1 id="result">-</h1>
            <p id="confidence">Confidence: -</p>
        </div>   
    </div>
  );
};

export default Home;
