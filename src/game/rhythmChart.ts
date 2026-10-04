export interface RhythmNoteData {
  id: string;
  time: number; // timestamp in seconds from song start
  lane: 0 | 1 | 2 | 3; // 0: Pink (🌸), 1: Cyan (💎), 2: Yellow (⭐), 3: Purple (🔮)
  type: 'normal' | 'bonus';
  hit?: boolean;
  missed?: boolean;
}

// Precise beat timestamps synchronized to ABBA - Dancing Queen
export const DANCING_QUEEN_CHART: RhythmNoteData[] = [
  // Intro Piano Glissando & Strings (0s - 6s)
  { id: 'dq_1', time: 1.5, lane: 0, type: 'normal' },
  { id: 'dq_2', time: 2.8, lane: 1, type: 'normal' },
  { id: 'dq_3', time: 4.0, lane: 2, type: 'bonus' },
  { id: 'dq_4', time: 5.2, lane: 3, type: 'normal' },

  // First Disco Bass Kick & Piano Chord ("Having the time of your life...") (6s - 14s)
  { id: 'dq_5', time: 6.5, lane: 0, type: 'normal' },
  { id: 'dq_6', time: 7.6, lane: 2, type: 'normal' },
  { id: 'dq_7', time: 8.8, lane: 1, type: 'bonus' },
  { id: 'dq_8', time: 9.9, lane: 3, type: 'normal' },
  { id: 'dq_9', time: 11.1, lane: 0, type: 'normal' },
  { id: 'dq_10', time: 12.2, lane: 2, type: 'bonus' },
  { id: 'dq_11', time: 13.4, lane: 1, type: 'normal' },

  // Chorus Glissando ("Ooh, see that girl...") (14s - 24s)
  { id: 'dq_12', time: 14.5, lane: 3, type: 'normal' },
  { id: 'dq_13', time: 15.6, lane: 0, type: 'normal' },
  { id: 'dq_14', time: 16.8, lane: 1, type: 'bonus' },
  { id: 'dq_15', time: 17.9, lane: 2, type: 'normal' },
  { id: 'dq_16', time: 19.0, lane: 3, type: 'normal' },
  { id: 'dq_17', time: 20.2, lane: 0, type: 'bonus' },
  { id: 'dq_18', time: 21.3, lane: 1, type: 'normal' },
  { id: 'dq_19', time: 22.5, lane: 2, type: 'normal' },
  { id: 'dq_20', time: 23.6, lane: 3, type: 'bonus' },

  // Disco Beat Climax ("You are the Dancing Queen...") (24s - 40s)
  { id: 'dq_21', time: 24.8, lane: 0, type: 'normal' },
  { id: 'dq_22', time: 25.9, lane: 1, type: 'normal' },
  { id: 'dq_23', time: 27.0, lane: 2, type: 'bonus' },
  { id: 'dq_24', time: 28.2, lane: 3, type: 'normal' },
  { id: 'dq_25', time: 29.3, lane: 0, type: 'normal' },
  { id: 'dq_26', time: 30.5, lane: 1, type: 'bonus' },
  { id: 'dq_27', time: 31.6, lane: 2, type: 'normal' },
  { id: 'dq_28', time: 32.8, lane: 3, type: 'normal' },
  { id: 'dq_29', time: 33.9, lane: 0, type: 'bonus' },
  { id: 'dq_30', time: 35.1, lane: 1, type: 'normal' },
  { id: 'dq_31', time: 36.2, lane: 2, type: 'normal' },
  { id: 'dq_32', time: 37.4, lane: 3, type: 'bonus' },
  { id: 'dq_33', time: 38.8, lane: 1, type: 'normal' },
];

export const SONG_DURATION_SECONDS = 42;
