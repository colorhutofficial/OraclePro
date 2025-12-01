import React, { useState, useRef, useEffect } from 'react';
import { Move, Maximize, X } from 'lucide-react';
import Button from './Button';

// Since we cannot actually overlay other OS windows in a web app,
// We simulate the experience by providing a transparent, resizable window
// over a dummy "Game" background.

const OverlaySelector: React.FC = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ w: 300, h: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize') => {
    e.preventDefault();
    if (type === 'drag') setIsDragging(true);
    if (type === 'resize') setIsResizing(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;

      if (isDragging) {
        setPosition(p => ({ x: p.x + dx, y: p.y + dy }));
      }
      if (isResizing) {
        setSize(s => ({ w: Math.max(100, s.w + dx), h: Math.max(50, s.h + dy) }));
      }

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
      
      {/* Fake Game Background to demonstrate overlay transparency */}
      <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none select-none">
        <div className="text-zinc-600 text-9xl font-black rotate-12 transform scale-150">GAME VIEW</div>
        <div className="absolute bottom-10 left-10 text-zinc-500 font-mono">1.20x</div>
        <div className="absolute top-10 right-10 text-zinc-500 font-mono">22.40x</div>
      </div>

      <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-4 py-2 rounded-lg text-sm text-zinc-300">
        <h2 className="font-bold text-white mb-1">OCR Capture Simulation</h2>
        <p className="text-xs">Drag the red box over the multiplier area.</p>
      </div>

      {/* The Draggable Overlay Box */}
      <div 
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`, 
          width: size.w, 
          height: size.h 
        }}
        className="absolute top-0 left-0 bg-red-500/20 border-2 border-orange-500 shadow-[0_0_15px_rgba(255,106,0,0.5)] rounded-lg flex flex-col group cursor-move z-20"
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        {/* Header/Handle */}
        <div className="h-6 bg-orange-500/80 w-full flex items-center justify-between px-2 cursor-grab active:cursor-grabbing">
           <span className="text-[10px] font-bold text-white uppercase tracking-wider">Scanner Active</span>
           <Move size={12} className="text-white"/>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[1px] bg-red-500/50 absolute top-1/2"></div>
            <div className="h-full w-[1px] bg-red-500/50 absolute left-1/2"></div>
        </div>

        {/* Resize Handle */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 text-orange-500 hover:text-white transition-colors"
          onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize'); }}
        >
          <div className="w-2 h-2 bg-orange-500 rounded-full shadow-lg"></div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex gap-2">
        <Button variant="secondary" onClick={() => { setPosition({x: 50, y:50}); setSize({w:300, h:200}); }}>
          Reset Position
        </Button>
      </div>

    </div>
  );
};

export default OverlaySelector;
