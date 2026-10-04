export type SectionId = 'game' | 'surprise' | 'wishes';

export type GameStage = 
  | 'intro'
  | 'claw_intro'
  | 'claw_game'
  | 'claw_machine'
  | 'scroll_found'
  | 'your_scrolls'
  | 'all_scrolls_collected'
  | 'clues_reveal'
  | 'hidden_objects'
  | 'puzzle'
  | 'combination_lock'
  | 'treasure_unlocked'
  | 'beat_battle'
  | 'completed';

export interface SecretScroll {
  id: string;
  title: string;
  hintText: string;
  icon?: string;
  collected?: boolean;
}

export interface HiddenObject {
  id: string;
  name: string;
  icon: string;
  found: boolean;
  xPercent: number;
  yPercent: number;
  hint: string;
}

export interface PuzzleItem {
  id: string;
  name: string;
  icon: string;
  orderHint: string;
}

export interface PantunLine {
  text: string;
  delayMs?: number;
}
