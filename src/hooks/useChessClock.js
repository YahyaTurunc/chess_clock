import { useState, useEffect, useRef, useCallback } from 'react';

export const useChessClock = (initialTime, increment) => {
    const [whiteTime, setWhiteTime] = useState(initialTime);
    const [blackTime, setBlackTime] = useState(initialTime);
    const [activePlayer, setActivePlayer] = useState(null); // 'white' or 'black' or null (not started/paused)
    const [isPaused, setIsPaused] = useState(true);
    const [whiteMoves, setWhiteMoves] = useState(0);
    const [blackMoves, setBlackMoves] = useState(0);
    const [gameStatus, setGameStatus] = useState('idle'); // 'idle', 'running', 'paused', 'finished'

    const intervalRef = useRef(null);
    const lastTickRef = useRef(Date.now());

    const resetGame = useCallback(() => {
        setWhiteTime(initialTime);
        setBlackTime(initialTime);
        setActivePlayer(null);
        setIsPaused(true);
        setWhiteMoves(0);
        setBlackMoves(0);
        setGameStatus('idle');
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [initialTime]);

    const togglePause = useCallback(() => {
        if (gameStatus === 'finished') return;

        if (isPaused) {
            // Resume
            setIsPaused(false);
            setGameStatus('running');
            lastTickRef.current = Date.now();

            // If game hasn't started, start with White (standard) or whoever was active
            if (!activePlayer) {
                // Usually white starts, but let's wait for first tap to define who starts if it's truly neutral?
                // Requirement says: "When the game starts, both timers are paused. Tapping the active (green) area stops that timer and starts the opponent's timer."
                // Actually, usually you tap YOUR side to start the OTHER person's clock.
                // Or, in a fresh game, Black presses their clock to start White's time.
                // Let's implement: Game starts PAUSED.
                // Players tap their side to "end their turn" (start opponent).
                // If no one has moved, tapping a side starts the OTHER side.
            }
        } else {
            // Pause
            setIsPaused(true);
            setGameStatus('paused');
        }
    }, [isPaused, gameStatus, activePlayer]);

    const switchTurn = useCallback((playerWhoPressed) => {
        if (gameStatus === 'finished') return;

        // If game is idle (just started), the player who presses starts the OTHER player's clock.
        if (gameStatus === 'idle' || activePlayer === null) {
            const nextPlayer = playerWhoPressed === 'white' ? 'black' : 'white';
            setActivePlayer(nextPlayer);
            setGameStatus('running');
            setIsPaused(false);
            lastTickRef.current = Date.now();
            return;
        }

        // Standard play: Only the ACTIVE player can press their clock to switch turn.
        // Wait, usually in UI, the active player is the one whose clock is ticking. They press to stop theirs and start opponent.
        if (playerWhoPressed === activePlayer) {
            // Apply increment to the player who just finished their move
            if (activePlayer === 'white') {
                setWhiteTime(prev => prev + increment);
                setWhiteMoves(prev => prev + 1);
                setActivePlayer('black');
            } else {
                setBlackTime(prev => prev + increment);
                setBlackMoves(prev => prev + 1);
                setActivePlayer('white');
            }
            lastTickRef.current = Date.now();
        }
    }, [activePlayer, gameStatus, increment]);

    useEffect(() => {
        if (gameStatus === 'running' && !isPaused && activePlayer) {
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const delta = now - lastTickRef.current;
                lastTickRef.current = now;

                if (activePlayer === 'white') {
                    setWhiteTime(prev => {
                        const next = prev - (delta / 1000);
                        if (next <= 0) {
                            setGameStatus('finished');
                            return 0;
                        }
                        return next;
                    });
                } else {
                    setBlackTime(prev => {
                        const next = prev - (delta / 1000);
                        if (next <= 0) {
                            setGameStatus('finished');
                            return 0;
                        }
                        return next;
                    });
                }
            }, 100); // Update every 100ms for smoothness, though we track precise delta
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [gameStatus, isPaused, activePlayer]);

    return {
        whiteTime,
        blackTime,
        activePlayer,
        isPaused,
        whiteMoves,
        blackMoves,
        gameStatus,
        resetGame,
        togglePause,
        switchTurn,
    };
};
