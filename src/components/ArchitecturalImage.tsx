import { useState } from 'react';
import { Compass } from 'lucide-react';

interface ArchitecturalImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  onClick?: () => void;
}

export function ArchitecturalImage({
  src,
  alt,
  className = '',
  aspectClassName = '',
  priority = false,
  onClick,
}: ArchitecturalImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#D9CCB8]/45 text-[#252521]/70 border border-[#252521]/10 p-6 text-center ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Compass className="w-6 h-6 mb-2 stroke-[1.25] text-[#252521]/50" />
        <span className="font-serif text-base italic tracking-wide">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#D9CCB8]/30 ${aspectClassName}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        onClick={onClick}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${onClick ? 'cursor-zoom-in' : ''} ${className}`}
      />
    </div>
  );
}
