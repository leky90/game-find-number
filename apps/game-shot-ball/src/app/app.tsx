// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef } from 'react';
import useGameplay from './use-gameplay/use-gameplay';
import styles from './app.module.scss';

export function App() {
  const canvasRef = useRef(null);

  const { play, replay, status, score } = useGameplay({ ref: canvasRef });

  return (
    <>
      {status === 'idle' && (
        <button onClick={play} className={styles['play']}>
          Play
        </button>
      )}
      {status === 'running' && (
        <button onClick={replay} className={styles['re-play']}>
          Re-Play
        </button>
      )}
      {status === 'stop' && (
        <div className={styles['board-result']}>
          <h1>Congrulation!</h1>
          <p>
            You finished this game in{' '}
            <strong style={{ color: 'red' }}>{score} seconds</strong>
          </p>
          <button onClick={replay}>Re-Play</button>
        </div>
      )}

      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default App;
