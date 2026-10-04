# A Special Birthday Surprise for Mba Alin 💐🎂

A personalized, elegant, interactive digital birthday gift built for **Alin Veronika (Mba Alin)**, CEO of **Avenew Group**, created by three interns: **Sabil, Calista, and Joy (The Interns)**.

This website combines a modern white & pastel design system, a 3-stage interactive adventure game, a dramatic flower surprise photo reveal, an interactive pantun performance, a YouTube birthday song player, and a grand celebration with infinite confetti!

---

## 🎨 Technology Stack

- **React 18 & TypeScript**: Core component framework and type-safe code.
- **Vite**: Development server and production bundler.
- **Tailwind CSS**: Pastel & white design system (`#FFFFFF`, `#DCEEFF`, `#3B82F6`, `#FCE7EF`, `#F472B6`, `#F5C453`).
- **Framer Motion**: Smooth section transitions, modal reveals, and button interactions.
- **Lucide React**: Modern icons.
- **Canvas Confetti**: Celebratory confetti rain and flower petal bursts.
- **Web Audio API & Web Speech API**: Built-in sound synthesis (pops, sparkle, lock click, applause, candle blowout) and Indonesian voice speech synthesis for pantun reading.
- **YouTube Embedded Player**: Privacy-enhanced YouTube player for video ID `mAJa4SF_VVI`.

---

## 🎮 The 3 Primary Sections

### 01 — GAME: Operasi Surprise Mba Alin 🎮
- **Challenge 1 (Find Clues 🔍)**: Interactive party room to find 🔑 Kunci Emas, 🌸 Bunga Pink, 💌 Kartu Ucapan with progressive hints (*"BUTUH PETUNJUK? 💡"*).
- **Challenge 2 (Solve Puzzle 🧩)**: Order 🌸 Bunga → 🎂 Kue → 🎁 Hadiah to reveal secret code `259`.
- **Challenge 3 (Unlock Gift 🔐)**: 3-digit combination lock using code `259` to unlock the surprise.

### 02 — SURPRISE: The Big Reveal 💐
- Animated countdown (3... 2... 1...) -> Unboxing animation -> Photomontage reveal `/images/birthday/flower-surprise.jpg`.
- Banner: *"SURPRIIIIISE, MBA ALINNN!!! 🎉💐"*.
- Dedicated signature: *"With love, Sabil, Calista & Joy — Your Interns at Avenew Group"*.

### 03 — WISHES: Birthday Celebration 🎤🎂
- **Interactive Pantun**: Line-by-line reveal with Indonesian voice reading & loud *"CAKEPPPP MBA ALINNN!!! 🤣👏"* crowd cheer!
- **Heartfelt Wishes**: Personal message card signed *"With love & lots of appreciation, Sabil, Calista & Joy — THE INTERN 💗"*.
- **Interactive Cake**: *"TIUP LILIN! 💨"* candle-extinguishing animation with sound FX.
- **YouTube Song Player**: Integrated player for `https://youtu.be/mAJa4SF_VVI`.
- **Grand Finale**: Infinite confetti cannon button (*"LET'S CELEBRATE! 🥳"*).

---

## 📸 How to Upload the Real Photo

Save the edited photograph of **Sabil, Calista, and Joy** presenting flowers to **Mba Alin** in the public assets directory:

📁 **`public/images/birthday/flower-surprise.jpg`**

- Recommended Resolution: 1920x1080 (or portrait format)
- Format: JPG or PNG

An elegant floral placeholder will render automatically until the physical photo file is placed.

---

## ⚙️ How to Personalize Content & Config

All texts, names, pantun lines, secret codes, and YouTube video IDs are centralized in:

📁 **`src/config/birthdayConfig.ts`**

- **CEO Name**: `ceoName: "Alin Veronika"`, `displayName: "Mba Alin"`
- **Intern Names**: `interns: ["Sabil", "Calista", "Joy"]`
- **Secret Code**: `secretCode: "259"`
- **YouTube ID**: `youtubeVideoId: "mAJa4SF_VVI"`
- **Pantun Text**: Edit the array in `pantun: [...]`

---

## 🚀 Quick Start & Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the repository in your **Vercel Dashboard**.
3. Framework Preset: **Vite** (automatically detected).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**! 🚀
