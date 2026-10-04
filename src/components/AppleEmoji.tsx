import React, { useState } from 'react';

interface AppleEmojiProps {
  emoji: string;
  className?: string;
  size?: number | string;
  alt?: string;
}

export const AppleEmoji: React.FC<AppleEmojiProps> = ({
  emoji,
  className = '',
  size = 24,
  alt,
}) => {
  const [hasError, setHasError] = useState(false);
  const encodedEmoji = encodeURIComponent(emoji);
  const cdnUrl = `https://emojicdn.elk.sh/${encodedEmoji}?style=apple`;

  if (hasError) {
    return <span className={`inline-block apple-emoji ${className}`}>{emoji}</span>;
  }

  const dimension = typeof size === 'number' ? `${size}px` : size;

  return (
    <img
      src={cdnUrl}
      alt={alt || emoji}
      onError={() => setHasError(true)}
      loading="lazy"
      style={{
        width: dimension,
        height: dimension,
        display: 'inline-block',
        verticalAlign: '-0.18em',
      }}
      className={`select-none pointer-events-none inline-block mx-0.5 ${className}`}
    />
  );
};

interface AppleEmojiTextProps {
  text: string;
  className?: string;
  emojiSize?: number | string;
}

export const AppleEmojiText: React.FC<AppleEmojiTextProps> = ({
  text,
  className = '',
  emojiSize = 18,
}) => {
  // Regex to match any Unicode emoji character sequences
  const emojiRegex = /(\p{Extended_Pictographic}[\uFE0E\uFE0F\u200D\p{Extended_Pictographic}]*)/gu;
  const parts = text.split(emojiRegex);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (!part) return null;
        if (part.match(emojiRegex)) {
          return (
            <AppleEmoji
              key={idx}
              emoji={part}
              size={emojiSize}
              className="inline-block"
            />
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};
