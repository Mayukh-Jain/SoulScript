# SoulScript ✨

> Transform memories into an immersive Valentine's Day experience

SoulScript is a narrative-driven, interactive digital gift engine that transforms personal memories into a premium storytelling experience. Built with privacy-first architecture and featuring high-end motion design, it creates an unforgettable journey for your special someone.

[![Made with React](https://img.shields.io/badge/React-18.x-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Styled with Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Animated with Framer Motion](https://img.shields.io/badge/Framer-Motion-ff0055?style=flat&logo=framer)](https://www.framer.com/motion/)

---

## 🎯 Overview

Unlike traditional digital cards, SoulScript is built to be an **experience**. It guides your recipient through:

- 💝 **Playful Proposal Gatekeeper** - An interactive "Will you be my Valentine?" sequence
- 📖 **Heartfelt Narrative Timeline** - A chronological journey through your shared memories
- 🔐 **Secret Vault** - A scratch-to-reveal message with immersive parallax scrolling

### ✨ What Makes It Special

```
Traditional Digital Card          SoulScript Experience
─────────────────────            ──────────────────────
📧 Static message                 🎬 Interactive narrative
💾 Database storage               🔒 Privacy-first (no servers)
📄 Single page                    🌊 Multi-stage journey
🖼️ Basic gallery                 🎆 3D parallax dive effect
```

---

## 🚀 Key Features

### 🔐 Privacy-First Architecture
- **Zero Database Storage**: All memories, messages, and image URLs are encoded directly into shareable links using Base64
- **Complete Data Privacy**: No server-side storage means your intimate moments stay truly private
- **Instant Sharing**: Generate and share links without any backend processing

### 🎨 Immersive Animations
- **300vh Zoom Parallax**: Custom-built depth-scroll gallery creating a "diving into memories" effect
- **Glassmorphic UI**: Modern, elegant design with translucent elements and backdrop blur
- **Smooth Transitions**: Powered by Framer Motion for buttery-smooth animations

### 🎭 Interactive Micro-interactions
- **Persuasive UX**: Dynamic "Yes/No" buttons where "No" shrinks and "Yes" grows
- **Scratch-to-Reveal**: HTML5 Canvas-based secret note with shimmering rose-gold effect
- **Confetti Celebrations**: Delightful visual feedback on key interactions
- **Music Integration**: YouTube-powered background music for emotional ambiance

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18.x (Vite) |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Routing** | React Router v6 |
| **Canvas** | HTML5 Canvas API |
| **Effects** | Canvas-Confetti |

---

## 📂 Project Structure

```
SoulScript/
├── src/
│   ├── components/
│   │   ├── CreatorPage.jsx      # Memory curation dashboard
│   │   ├── ProposalPage.jsx     # Interactive Valentine proposal
│   │   ├── RevealPage.jsx       # Main narrative experience
│   │   └── ZoomParallax.jsx     # Scroll-based gallery component
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
└── package.json
```

### Component Breakdown

| Component | Responsibility |
|-----------|----------------|
| `CreatorPage` | Dashboard for curating timeline, messages, and multimedia |
| `ProposalPage` | Interactive gatekeeper with persuasive UX elements |
| `RevealPage` | Main narrative experience with journey and secret vault |
| `ZoomParallax` | High-impact 300vh scroll-based photo gallery |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mayukh-Jain/SoulScript.git
   cd SoulScript
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

---

## 📖 Usage Guide

### Creating Your Experience

1. **Open the Creator Page**
   - Navigate to the app's homepage

2. **Personalize the Journey**
   - Enter both names (yours and your partner's)
   - Write a heartfelt love letter
   - Add timeline events with descriptions and dates

3. **Add Multimedia**
   - Upload images to a hosting service (e.g., [Postimages.org](https://postimages.org/))
   - Paste direct image URLs into the timeline
   - Add a YouTube link for background music (optional)

4. **Craft the Secret Note**
   - Write a special message for the scratch-to-reveal vault

5. **Generate the Magic Link**
   - Click "Generate Link"
   - Copy the encoded URL

6. **Share with Your Person!** 💌
   - Send the link via text, email, or any messaging platform
   - Watch the magic unfold!

### How the Recipient Experiences It

```
Step 1: Interactive Proposal
    ↓
Step 2: Narrative Timeline Journey
    ↓
Step 3: Dive Into Photo Memories (Parallax Scroll)
    ↓
Step 4: Scratch-to-Reveal Secret Message
    ↓
Step 5: Celebration! 🎉
```

---

## 🎨 Design Philosophy

SoulScript embraces a **minimalist, emotion-first** approach:

- **Glassmorphism**: Translucent cards with subtle blur effects
- **Purposeful Motion**: Every animation serves the narrative
- **Tactile Interactions**: Touch-friendly elements that feel responsive
- **Emotional Pacing**: Carefully timed reveals that build anticipation

---

## 🤝 Contributing

Contributions are welcome! Whether you want to:
- 🐛 Fix bugs
- ✨ Add new features
- 📝 Improve documentation
- 🎨 Enhance UI/UX

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 About the Developer

**Mayukh Jain**  
*VIT Bhopal*

This project showcases modern frontend engineering, creative UX design, and the intersection of technology with human emotion.

### Connect
- 📷 Instagram: [@mayukh__jain](https://instagram.com/mayukh__jain)
- 🌐 Portfolio: [mayukhjain.vercel.app/](https://mayukhjain.vercel.app/)
- 💼 GitHub: [@Mayukh-Jain](https://github.com/Mayukh-Jain)

---

## 🙏 Acknowledgments

- Inspired by the timeless magic of heartfelt storytelling
- Built with modern web technologies and lots of ❤️
- Special thanks to the React and Framer Motion communities

---

<div align="center">

**Made with ❤️ for couples who believe in digital romance**

© 2026 SoulScript | Crafted by [Mayukh Jain](https://mayukhjain.vercel.app/)

*"Because every love story deserves a beautiful telling"*

</div>