import { useEffect, useState } from 'react';
import './App.css';
import { useAppContext } from './context/AppContext';
import actionTypes from './context/reducers/actionTypes';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world';

const boxesStyle = (rows) => {
  return {
    gridTemplateRows: `repeat(${rows}, minmax(10px, 100px))`,
    gridTemplateColumns: `repeat(${rows}, minmax(10px, 100px))`
  };
};

function App() {
  const { width, height } = useWindowSize();
  const state = useAppContext();
  const [boxes, setBoxes] = useState([]);
  const [completed, setCompleted] = useState({});
  const [prev, setPrev] = useState(-1);
  const [curr, setCurr] = useState(-1);
  const [totalBoxes, setTotalBoxes] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(15); // Set initial score to 15
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const totalBoxes = Math.floor((state.boxSize * state.boxSize) / 2);
    setTotalBoxes(totalBoxes);
    const halfTheBoxes = new Array(totalBoxes).fill(0).map((_, i) => i + 1);
    const newBoxes = [...halfTheBoxes, ...halfTheBoxes];
    newBoxes.sort(() => Math.random() - 0.5);
    setBoxes(newBoxes);
  }, [state.boxSize]);

  useEffect(() => {
    if (prev === -1 || curr === -1) return;
    if (boxes[prev] === boxes[curr]) {
      const obj = {
        ...completed,
        [boxes[curr]]: true
      };
      setCompleted(obj);
      setScore(score + 10); // Add 10 points for a correct match
    } else {
      setScore(score - 5); // Deduct 5 points for an incorrect match
    }
    setMoves(moves + 1); // Increment moves
  }, [curr]);

  useEffect(() => {
    if (Object.keys(completed).length === totalBoxes) {
      setShowConfetti(true);
      setTimeout(() => {
        state.dispatch({ type: actionTypes.NEXT_LEVEL });
        setShowConfetti(false);
        setCompleted({});
        setPrev(-1);
        setCurr(-1);
      }, 5000);
    }

    if (score <= 0) {
      setGameOver(true); // Set game over status
    }
  }, [completed, score]);

  const pictureSelected = (idx) => {
    if (idx === prev || completed[boxes[idx]]) return;

    if (prev === -1) {
      setPrev(idx);
    } else if (curr === -1) {
      setCurr(idx);
    } else {
      setPrev(idx);
      setCurr(-1);
    }
  };

  const handleRetry = () => {
    window.location.reload(); // Reload the page
  };

  const handleExit = () => {
    window.close(); // Navigate to an empty URL
  };

  return (
    <div className="App">
      {showConfetti && <Confetti width={width} height={height} />}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100vh' }}>
        <h2>Level: {state.level}</h2>
        <div className="score-moves-box" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ marginRight: '20px', fontWeight: 'bold', fontSize: '24px' }}>Score: {score}</div>
          <div style={{ fontWeight: 'bold', fontSize: '24px' }}>Moves: {moves}</div>
        </div>
        <div className="boxes" style={boxesStyle(state.boxSize)}>
          {boxes.map((box, i) => (
            <div
              key={i}
              className={`box ${(prev === i || curr === i || completed[box]) ? 'active' : ''} ${
                completed[box] ? 'completed' : ''
              }`}
              onClick={() => pictureSelected(i)}
            >
              <img src={`${url}/${box}.svg`} alt={`pokemon-${box}`} />
              <div className="overlay"></div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={gameOver} onClose={handleRetry}>
        <DialogTitle>You lost</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to retry or exit the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Button variant="outlined" onClick={handleRetry} sx={{ minWidth: '100px', padding: '10px' }}>
              Retry
            </Button>
            <Button variant="outlined" onClick={handleExit} sx={{ minWidth: '100px', padding: '10px' }}>
              Exit
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
  
  
}

export default App;

