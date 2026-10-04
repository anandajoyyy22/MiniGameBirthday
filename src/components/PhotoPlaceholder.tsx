import React, { useState } from 'react';
import { Camera, Sparkles, Heart, Users } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { AppleEmoji } from './AppleEmoji';

interface PhotoPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export const PhotoPlaceholder: React.FC<PhotoPlaceholderProps> = ({
  src,
  alt,
  className = '',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-3xl border border-rose-900/15 bg-white p-8 sm:p-12 shadow-sm text-slate-800 transition-all duration-300 ${className}`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-6 px-2">
          {/* Avatar / Icon Stack */}
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#720D23] via-[#8B102B] to-[#D4AF37] p-1 shadow-lg shadow-rose-900/20 flex items-center justify-center animate-bounce-soft">
              <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center shadow-inner">
                <img
                  src="/images/birthday/mba-alin-photo.jpg"
                  alt="Mba Alin Veronika"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-[#D4AF37] animate-pulse" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-[#8B102B] font-bold text-xs uppercase tracking-wider mb-3 border border-rose-900/15 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-[#8B102B]" /> Alin Veronika • CEO Avenew Group
          </span>

          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#5C0B1C] mb-2 tracking-tight flex items-center gap-2 justify-center">
            <span>Foto Spesial Mba Alin</span>
            <AppleEmoji emoji="💐" size={24} />
          </h3>

          <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed font-medium">
            Unggah foto edisi kejutan bunga bertiga ({birthdayConfig.interns.join(', ')}) bersama {birthdayConfig.displayName} di lokasi berikut:
          </p>

          <div className="bg-rose-50/50 border border-rose-900/15 rounded-2xl p-4 text-xs font-mono text-left text-slate-700 max-w-md w-full shadow-2xs space-y-1.5">
            <div className="text-[#8B102B] font-bold mb-1 flex items-center gap-1">
              <span>📌 Path Foto Utama:</span>
            </div>
            <div>• Path: <span className="text-[#720D23] font-bold">{src}</span></div>
            <div>• Format: <span className="text-[#720D23] font-bold">JPG / PNG</span></div>
            <div>• Rekomendasi: <span className="text-[#720D23] font-bold">Landscape 1920x1080 / Portrait</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 bg-pink-50/90 animate-pulse flex items-center justify-center">
          <Camera className="w-8 h-8 text-rose-400 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};
