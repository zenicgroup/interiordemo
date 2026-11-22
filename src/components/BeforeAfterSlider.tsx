import React, { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Structure · 1994',
  afterLabel = 'Completed Transformation · 2025',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(52);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, pct)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[16/9] overflow-hidden select-none cursor-ew-resize bg-[#252521]"
        role="slider"
        aria-label="Before and after architectural transformation comparison"
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPosition((p) => Math.max(4, p - 4));
          if (e.key === 'ArrowRight') setPosition((p) => Math.min(96, p + 4));
        }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        </div>

        <div
          className="absolute inset-y-0 w-px bg-[#FFFFFF]/90 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-[#F4F1EA] text-[#252521] border border-[#252521]/20 flex items-center justify-center shadow-lg">
            <MoveHorizontal className="w-4 h-4 stroke-[1.5]" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-[#252521]/75 text-[#F4F1EA] px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute bottom-4 right-4 bg-[#F4F1EA]/90 text-[#252521] px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase pointer-events-none">
          {afterLabel}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#252521]/65 pt-1">
        <span>Drag divider or use arrow keys to compare pre-renovation structure against completed architecture.</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPosition(15)}
            className="underline underline-offset-4 hover:text-[#252521] cursor-pointer"
          >
            Focus Completed
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setPosition(50)}
            className="underline underline-offset-4 hover:text-[#252521] cursor-pointer"
          >
            50 / 50 Split
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={() => setPosition(85)}
            className="underline underline-offset-4 hover:text-[#252521] cursor-pointer"
          >
            Focus Original
          </button>
        </div>
      </div>
    </div>
  );
}
