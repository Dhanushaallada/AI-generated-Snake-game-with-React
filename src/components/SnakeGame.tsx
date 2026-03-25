import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 80;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = timestamp;
    const deltaTime = timestamp - lastUpdateTimeRef.current;

    if (deltaTime > INITIAL_SPEED) {
      moveSnake();
      lastUpdateTimeRef.current = timestamp;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameLoop]);

  return (
    <div className="hw-card p-8 flex flex-col items-center gap-8 relative overflow-hidden">
      {/* Top Status Bar */}
      <div className="flex justify-between w-full px-2">
        <div className="space-y-1">
          <span className="hw-label">Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-hw-accent leading-none">{score}</span>
            <span className="hw-label opacity-40">pts</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <span className="hw-label">High Score</span>
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-3xl font-bold font-mono text-hw-text-primary leading-none">{highScore}</span>
            <span className="hw-label opacity-40">pts</span>
          </div>
        </div>
      </div>

      {/* Game Grid Container */}
      <div className="relative p-1 bg-hw-bg/5 rounded-lg border border-hw-text-secondary/20">
        <div 
          className="relative bg-black/40 overflow-hidden rounded-sm"
          style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
        >
          {/* Grid Lines Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Snake */}
          {snake.map((segment, i) => (
            <motion.div
              key={`${i}-${segment.x}-${segment.y}`}
              initial={false}
              animate={{ x: segment.x * 20, y: segment.y * 20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ 
                opacity: 1 - (i / snake.length) * 0.6,
              }}
              className={`absolute w-5 h-5 rounded-[2px] ${
                i === 0 
                  ? 'bg-hw-accent hw-active-glow z-10' 
                  : 'bg-hw-text-secondary'
              }`}
            />
          ))}

          {/* Food */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute w-5 h-5 bg-hw-accent rounded-full border-2 border-hw-card"
            style={{ left: food.x * 20, top: food.y * 20 }}
          />

          {/* Overlays */}
          <AnimatePresence>
            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-hw-card/90 backdrop-blur-sm flex flex-col items-center justify-center z-20"
              >
                <div className="hw-label text-hw-accent mb-2">Critical Failure</div>
                <h2 className="text-2xl font-bold text-hw-text-primary mb-6 uppercase tracking-tight">Game Over</h2>
                <button 
                  onClick={resetGame}
                  className="px-6 py-2 bg-hw-accent text-hw-card font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors rounded"
                >
                  Reset Module
                </button>
              </motion.div>
            )}

            {isPaused && !isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-hw-card/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-20"
              >
                <button 
                  onClick={() => setIsPaused(false)}
                  className="w-16 h-16 bg-hw-card/80 rounded-full flex items-center justify-center border border-hw-accent/50 hover:border-hw-accent transition-all group hw-active-glow"
                >
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-hw-accent border-b-[8px] border-b-transparent ml-1 group-hover:scale-110 transition-transform" />
                </button>
                <p className="mt-4 hw-label">Standby Mode</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls Info */}
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-hw-accent" />
          <span className="hw-label">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-hw-text-secondary" />
          <span className="hw-label">Standby</span>
        </div>
      </div>
    </div>
  );
};
