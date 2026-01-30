
import React, { useEffect, useState } from 'react';

interface RedEnvelopeProps {
  amount?: string;
  symbol?: string;
  isOpen: boolean;
  onOpen?: () => void;
  message?: string;
}

const RedEnvelope: React.FC<RedEnvelopeProps> = ({ 
  amount, 
  symbol = 'ETH', 
  isOpen, 
  onOpen, 
  message = "Best Wishes!" 
}) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="relative w-full max-w-[320px] mx-auto aspect-[3/4.5] perspective-1000 group">
      {/* Particle Effect Layer */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-particle"
              style={{
                left: '50%',
                top: '50%',
                '--x': `${(Math.random() - 0.5) * 400}px`,
                '--y': `${(Math.random() - 0.5) * 400}px`,
                '--rotate': `${Math.random() * 360}deg`,
                animationDelay: `${Math.random() * 0.2}s`,
              } as any}
            />
          ))}
        </div>
      )}

      <div className={`relative w-full h-full transition-all duration-1000 transform-style-3d ${isOpen ? 'translate-y-4' : 'hover:-translate-y-2'}`}>
        
        {/* Envelope Body (Back Layer) */}
        <div className="absolute inset-0 bg-red-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800"></div>
          {/* Inner Content (The Gift Card) */}
          <div 
            className={`absolute inset-x-4 bottom-4 bg-white rounded-xl p-6 shadow-inner transition-all duration-1000 flex flex-col items-center justify-center text-center
              ${isOpen ? 'h-[85%] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-20'}
            `}
          >
            <div className="text-3xl mb-2">✨</div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Received</p>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-black text-red-600">{amount || '0.00'}</span>
              <span className="text-sm font-bold text-red-400">{symbol}</span>
            </div>
            <div className="w-8 h-1 bg-red-100 rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm italic leading-relaxed">"{message}"</p>
          </div>
        </div>

        {/* Top Flap */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/3 origin-top transition-all duration-700 z-30
            ${isOpen ? '-rotate-x-180 opacity-0' : 'rotate-x-0'}
          `}
        >
          <div className="w-full h-full bg-red-600 rounded-t-2xl shadow-md border-b-2 border-yellow-500/20 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-red-700 border-2 border-yellow-500/30 flex items-center justify-center">
                <span className="text-yellow-500 font-bold">福</span>
             </div>
          </div>
        </div>

        {/* Front Cover (Front Layer) */}
        <div 
          onClick={() => !isOpen && onOpen?.()}
          className={`absolute inset-0 z-20 transition-all duration-700 cursor-pointer 
            ${isOpen ? 'opacity-0 pointer-events-none scale-95 translate-y-10' : 'opacity-100'}
          `}
        >
          <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl border-4 border-yellow-500/20 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-400/20 rounded-full blur-2xl"></div>
            
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-500 p-1 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center border-2 border-yellow-400/50">
                  <span className="text-4xl">🧧</span>
                </div>
              </div>
              <div className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-md animate-pulse"></div>
            </div>

            <h3 className="text-yellow-400 text-2xl font-black tracking-tight mb-1 text-shadow">OPEN ME</h3>
            <p className="text-red-100/60 text-[10px] font-bold uppercase tracking-[0.2em]">Gift Envelope</p>
            
            <div className="mt-8 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></span>
               TAP TO CLAIM
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-x-0 { transform: rotateX(0deg); }
        .rotate-x-180 { transform: rotateX(180deg); }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        @keyframes particle {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0) rotate(var(--rotate));
            opacity: 0;
          }
        }

        .animate-particle {
          animation: particle 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RedEnvelope;
