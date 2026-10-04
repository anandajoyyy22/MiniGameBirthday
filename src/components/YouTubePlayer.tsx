import React, { useState } from 'react';
import { Play, Pause, ExternalLink, Music } from 'lucide-react';
import { birthdayConfig } from '../config/birthdayConfig';
import { AppleEmoji } from './AppleEmoji';

export const YouTubePlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = birthdayConfig.youtubeVideoId;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`;
  const watchUrl = `https://youtu.be/${videoId}`;

  return (
    <div className="w-full max-w-xl mx-auto glass-card rounded-3xl p-5 sm:p-6 shadow-sm border border-rose-900/15">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-900/15 text-[#8B102B] flex items-center justify-center shadow-xs">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#5C0B1C] tracking-tight flex items-center gap-1.5">
              <span>SPECIAL BIRTHDAY SONG</span>
              <AppleEmoji emoji="🎶" size={16} />
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Putar lagu ulang tahun untuk {birthdayConfig.displayName}!</p>
          </div>
        </div>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#8B102B] hover:text-[#5C0B1C] font-bold flex items-center gap-1 bg-rose-50 border border-rose-900/15 px-3.5 py-1.5 rounded-full shadow-2xs hover:scale-105 transition-transform"
        >
          <span>YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
        <iframe
          title="Birthday Song for Mba Alin"
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Interactive Play Button */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-7 py-3 rounded-full bg-gradient-to-r from-[#720D23] via-[#8B102B] to-[#5C0B1C] text-white font-extrabold text-xs shadow-md shadow-rose-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>PAUSE LAGU</span>
              <AppleEmoji emoji="🎵" size={16} />
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>PUTAR LAGUNYA!</span>
              <AppleEmoji emoji="🎵" size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
