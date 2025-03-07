"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const FlappyBird: React.FC = () => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  // Bird state
  const [birdPosition, setBirdPosition] = useState(250);
  
  // Pipe state
  const [pipePosition, setPipePosition] = useState(400);
  const [pipeHeight, setPipeHeight] = useState(200);
  
  // Audio refs
  const deathSound = useRef<HTMLAudioElement | null>(null);
  const flapSound = useRef<HTMLAudioElement | null>(null);
  
  // Game constants
  const BIRD_SIZE = 40;
  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 200;
  
  // Handle jump
  const handleClick = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setBirdPosition(250);
      setPipePosition(400);
      setPipeHeight(Math.random() * 300 + 100);
      return;
    }
    
    if (gameOver) {
      setGameStarted(true);
      setGameOver(false);
      setScore(0);
      setBirdPosition(250);
      setPipePosition(400);
      setPipeHeight(Math.random() * 300 + 100);
      return;
    }
    
    // Jump
    setBirdPosition(prev => Math.max(0, prev - 60));
    if (flapSound.current) {
      flapSound.current.currentTime = 0;
      flapSound.current.play();
    }
  }, [gameStarted, gameOver]);
  
  // Game logic
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const interval = setInterval(() => {
      // Gravity effect
      setBirdPosition(prev => {
        const newPosition = prev + 5;
        
        // Check for ground collision
        if (newPosition >= GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          deathSound.current?.play();
          return GAME_HEIGHT - BIRD_SIZE;
        }
        
        return newPosition;
      });
      
      // Move pipe
      setPipePosition(prev => {
        const newPosition = prev - 5;
        
        // Reset pipe when it goes off screen
        if (newPosition <= -PIPE_WIDTH) {
          setPipeHeight(Math.random() * 300 + 100);
          setScore(prev => prev + 1);
          return GAME_WIDTH;
        }
        
        return newPosition;
      });
      
      // Check for collision with pipe
      if (
        pipePosition < 100 && 
        pipePosition + PIPE_WIDTH > 50 && 
        (birdPosition < pipeHeight || birdPosition + BIRD_SIZE > pipeHeight + PIPE_GAP)
      ) {
        setGameOver(true);
        deathSound.current?.play();
      }
      
    }, 30);
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, birdPosition, pipePosition, pipeHeight]);
  
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      <audio ref={deathSound} src="/bruh.mp3" preload="auto" />
      <audio ref={flapSound} src="/dry-fart.mp3" preload="auto" />
      <div
        className="relative bg-sky-200 overflow-hidden border-2 border-gray-900 cursor-pointer select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={handleClick}
      >
        {/* Bird */}
        <div
          className="absolute"
          style={{
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            left: 50,
            top: birdPosition,
          }}
        >
          <Image
            src="/owl.png"
            alt="Owl"
            width={BIRD_SIZE}
            height={BIRD_SIZE}
            className="rounded-full"
          />
        </div>
        
        {/* Pipes */}
        {/* Top pipe */}
        <div
          className="absolute bg-green-500 border-2 border-black"
          style={{
            width: PIPE_WIDTH,
            height: pipeHeight,
            left: pipePosition,
            top: 0,
          }}
        />
        
        {/* Bottom pipe */}
        <div
          className="absolute bg-green-500 border-2 border-black"
          style={{
            width: PIPE_WIDTH,
            height: GAME_HEIGHT,
            left: pipePosition,
            top: pipeHeight + PIPE_GAP,
          }}
        />
        
        {/* Ground */}
        <div
          className="absolute bg-amber-800 border-t-2 border-black w-full h-10 bottom-0"
        />
        
        {/* Score */}
        <div className="absolute top-4 left-0 w-full text-center text-4xl font-bold text-white drop-shadow-lg">
          {score}
        </div>
        
        {/* Start screen */}
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-4xl font-bold text-white mb-4">Flappy Bird</h1>
            <p className="text-xl text-white mb-8">Click to start</p>
          </div>
        )}
        
        {/* Game over screen */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <h1 className="text-4xl font-bold text-white mb-4">Game Over</h1>
            <p className="text-xl text-white mb-8">Score: {score}</p>
            <button
              className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500"
              onClick={handleClick}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center text-gray-600">
        <p>Click to jump</p>
      </div>
    </div>
  );
};

export default FlappyBird;