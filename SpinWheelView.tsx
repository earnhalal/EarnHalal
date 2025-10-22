// components/SpinWheelView.tsx
import React, { useState, useEffect, useRef } from 'react';

const MINIMUM_PRIZE_THRESHOLD = 1;

// --- Winning Animation Component ---
const WinAnimation: React.FC<{ prize: number; onAnimationEnd: () => void; isLowPrize: boolean; }> = ({ prize, onAnimationEnd, isLowPrize }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onAnimationEnd();
        }, 3000); // Animation duration
        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    const title = isLowPrize ? "So Close!" : "Congratulations!";
    const message = isLowPrize ? "Better luck next time!" : "Has been added to your wallet!";

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full animate-fall ${isLowPrize ? 'bg-blue-300' : 'bg-yellow-300'}`}
                        style={{
                            width: `${Math.random() * 10 + 5}px`,
                            height: `${Math.random() * 10 + 5}px`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${Math.random() * 3 + 3}s`,
                            opacity: Math.random()
                        }}
                    ></div>
                ))}
            </div>
            <div className="text-center text-white animate-popup z-10">
                <h2 className="text-4xl font-bold drop-shadow-lg">{title}</h2>
                <p className={`text-7xl font-extrabold my-4 drop-shadow-lg ${isLowPrize ? 'text-blue-400' : 'text-amber-400'}`}>{prize.toFixed(2)} Rs</p>
                <p className="text-xl">{message}</p>
            </div>
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-fall { animation: fall linear infinite; }
                @keyframes popup {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-popup { animation: popup 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};


interface SpinWheelViewProps {
  onWin: (amount: number) => void;
  balance: number;
  onBuySpin: (cost: number) => boolean;
}

const dailySegments = [
    { value: 50, label: '50' },
    { value: 10, label: '10' },
    { value: 100, label: '100' },
    { value: 5, label: '5' },
    { value: 20, label: '20' },
    { value: 0.01, label: '0.01' }, // The fixed winning prize for daily spin
    { value: 500, label: '500' },
    { value: 1, label: '1' },
];

const boughtSegments = [
    { value: 10, label: '10' },
    { value: 0.5, label: '0.5' },
    { value: 5, label: '5' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 0, label: 'Oops!' },
    { value: 8, label: '8' },
    { value: 3, label: '3' },
];

const FIXED_DAILY_WIN_INDEX = dailySegments.findIndex(s => s.value === 0.01);
const spinCosts = [1, 5, 10];

const SpinWheelView: React.FC<SpinWheelViewProps> = ({ onWin, balance, onBuySpin }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winningIndex, setWinningIndex] = useState<number | null>(null);
    const [hasUsedDailySpin, setHasUsedDailySpin] = useState(true);
    const [prizeToDisplay, setPrizeToDisplay] = useState<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const wheelSegments = hasUsedDailySpin ? boughtSegments : dailySegments;

    useEffect(() => {
        const lastSpinDate = localStorage.getItem('lastSpinDate');
        const today = new Date().toDateString();
        setHasUsedDailySpin(lastSpinDate === today);
        
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            window.removeEventListener('click', initAudio);
        };
        window.addEventListener('click', initAudio, { once: true });
    }, []);

    const playSound = (type: 'tick' | 'win' | 'low_win') => {
        const audioCtx = audioContextRef.current;
        if (!audioCtx || audioCtx.state === 'suspended') audioCtx?.resume();
        if (!audioCtx) return;

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;

        if (type === 'tick') {
            gainNode.gain.setValueAtTime(0.2, now);
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(Math.random() * 200 + 600, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } else {
             const playNote = (freq: number, startTime: number, duration: number) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.2, startTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            if (type === 'win') {
                playNote(523.25, now, 0.15); // C5
                playNote(659.25, now + 0.15, 0.15); // E5
                playNote(783.99, now + 0.3, 0.25); // G5
            } else if (type === 'low_win') {
                playNote(392.00, now, 0.2); // G4
                playNote(349.23, now + 0.2, 0.2); // F4
                playNote(329.63, now + 0.4, 0.3); // E4
            }
        }
    };
    
    const handleSpin = (cost: number = 0) => {
        if (isSpinning) return;

        const isDailySpin = cost === 0;
        
        if (isDailySpin) {
            if(hasUsedDailySpin) return;
            localStorage.setItem('lastSpinDate', new Date().toDateString());
            setHasUsedDailySpin(true);
        } else {
            const purchaseSuccess = onBuySpin(cost);
            if (!purchaseSuccess) {
                 alert("Insufficient balance to buy this spin.");
                 return;
            }
        }
        
        setWinningIndex(null);
        setIsSpinning(true);
        const tickInterval = setInterval(() => playSound('tick'), 120);

        const currentSegments = isDailySpin ? dailySegments : boughtSegments;
        const resolvedWinningIndex = isDailySpin ? FIXED_DAILY_WIN_INDEX : Math.floor(Math.random() * currentSegments.length);
        const segmentAngle = 360 / currentSegments.length;
        const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
        const targetAngle = 360 - (resolvedWinningIndex * segmentAngle) - (segmentAngle / 2) + randomOffset;
        
        const fullSpins = 6;
        const finalRotation = rotation + (360 * fullSpins) + targetAngle;
        setRotation(finalRotation);

        setTimeout(() => {
            clearInterval(tickInterval);
            const winningSegment = currentSegments[resolvedWinningIndex];
            if (winningSegment.value < MINIMUM_PRIZE_THRESHOLD) {
                playSound('low_win');
            } else {
                playSound('win');
            }
            setWinningIndex(resolvedWinningIndex);
            setPrizeToDisplay(winningSegment.value);
            setIsSpinning(false);
        }, 5000);
    };
    
    const segmentColors = ['#eef2ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3'];

    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        {prizeToDisplay !== null && (
            <WinAnimation 
                prize={prizeToDisplay} 
                isLowPrize={prizeToDisplay < MINIMUM_PRIZE_THRESHOLD}
                onAnimationEnd={() => {
                    if (prizeToDisplay > 0) onWin(prizeToDisplay);
                    setPrizeToDisplay(null);
                }} 
            />
        )}
        <style>{`
            @keyframes pulse-segment {
                50% { filter: brightness(1.15); }
            }
            .animate-pulse-segment { animation: pulse-segment 0.4s ease-in-out infinite alternate; }

            @keyframes winner-highlight {
                0% { transform: scale(1); filter: drop-shadow(0 0 0 transparent); }
                50% { transform: scale(1.1); filter: drop-shadow(0 0 20px #fbbf24); }
                100% { transform: scale(1.05); filter: drop-shadow(0 0 15px #fbbf24); }
            }
            .animate-winner > div { animation: winner-highlight 1.5s ease-out forwards; z-index: 10; position: relative; }
        `}</style>
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">Daily Spin & Win</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
          {hasUsedDailySpin ? 'Your free spin is used for today. Buy more spins or come back tomorrow!' : 'Try your luck once a day for a chance to win a prize!'}
        </p>
        
        <div className="relative w-full max-w-sm aspect-square mb-8">
            <div 
                className="absolute w-full h-full rounded-full border-[10px] border-primary-300 dark:border-primary-700 shadow-2xl transition-transform duration-[5000ms] ease-out-circ bg-white dark:bg-gray-700 overflow-hidden"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {wheelSegments.map((segment, index) => {
                    const angle = (360 / wheelSegments.length) * index;
                    const backgroundColor = segmentColors[index % segmentColors.length];
                    const textColor = index % 2 === 0 ? '#312e81' : '#ffffff';
                    return (
                        <div 
                            key={index}
                            className={`absolute w-1/2 h-1/2 origin-bottom-right 
                                ${!isSpinning && winningIndex === index ? 'animate-winner' : ''}`
                            }
                            style={{ 
                                transform: `rotate(${angle}deg)`,
                                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)',
                            }}
                        >
                           <div className={`w-full h-full flex items-center justify-center 
                                ${isSpinning ? 'animate-pulse-segment' : ''}`
                           }
                           style={{backgroundColor}}
                           >
                                <div 
                                    className="flex flex-col items-center justify-center text-center -rotate-45"
                                    style={{ transform: `translateY(-50%) rotate(${360/wheelSegments.length / 2}deg) ` }}
                                >
                                    <span className="font-extrabold text-2xl md:text-3xl" style={{color: textColor}}>{segment.label}</span>
                                    <span className="text-xs font-semibold" style={{color: textColor}}>Rs</span>
                                </div>
                           </div>
                        </div>
                    );
                })}
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4" style={{filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.4))'}}>
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-amber-500"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white dark:bg-gray-800 rounded-full border-8 border-amber-500 z-10 flex items-center justify-center font-bold text-primary-600">
                SPIN
            </div>
        </div>
        
        {!hasUsedDailySpin ? (
             <button
                onClick={() => handleSpin(0)}
                disabled={isSpinning}
                className="px-10 py-4 bg-amber-500 text-white font-bold text-xl rounded-full hover:bg-amber-600 transition-all transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isSpinning ? 'Spinning...' : 'SPIN FOR FREE!'}
            </button>
        ) : (
            <div className="w-full max-w-lg">
                 <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">Buy More Spins</h3>
                 <div className="grid grid-cols-3 gap-4">
                     {spinCosts.map(cost => (
                         <button
                            key={cost}
                            onClick={() => handleSpin(cost)}
                            disabled={isSpinning || balance < cost}
                            className="px-4 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                         >
                            Spin for {cost} Rs
                         </button>
                     ))}
                 </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Prizes are random and up to 10 Rs!</p>
            </div>
        )}
      </div>
    );
};

export default SpinWheelView;
