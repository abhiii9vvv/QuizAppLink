# QuizMaster Pro 🧠

A modern, interactive quiz application built with Next.js and React that tests your knowledge across multiple categories with gamification features.

## 🌟 Live Demo

**[Try QuizMaster Pro](https://v0-quiz-app-link.vercel.app/)**

## ✨ Features

### 🎯 Core Quiz Features
- **75+ Questions** across 11 diverse categories
- **Multiple Difficulty Levels** (Easy, Medium, Hard)
- **Question Types**: Multiple choice and True/False
- **Real-time Scoring** with instant feedback
- **Progress Tracking** with visual indicators
- **Detailed Explanations** for each answer

### ⏱️ Timer System
- **Per-Question Timer** (30 seconds each)
- **Total Quiz Timer** (customizable)
- **Pause/Resume** functionality
- **No Timer** option for relaxed learning

### 🎮 Gamification
- **XP System** with level progression
- **Achievement System** (10 unique achievements)
- **Streak Tracking** for consecutive correct answers
- **Power-ups**: Extra Time, 50/50, Skip Question
- **Performance Analytics** and statistics

### 🎨 Customization
- **4 Theme Options**: Light, Dark, Ocean Blue, Forest Green
- **Sound Effects** (can be toggled)
- **Category Selection** (choose specific topics)
- **Question Count** (5, 10, 15, or 20 questions)
- **Difficulty Filtering**

### 📊 Categories
- **Science** - Physics, Chemistry, Biology
- **Geography** - Countries, Capitals, Landmarks
- **Mathematics** - Arithmetic, Algebra, Geometry
- **History** - World events, Famous figures
- **Literature** - Classic works, Authors
- **Technology** - Programming, Companies, Concepts
- **Sports** - Rules, Records, Famous athletes
- **Entertainment** - Movies, TV shows, Pop culture
- **Food & Cooking** - Ingredients, Cuisine, Techniques
- **Art & Culture** - Famous artists, Museums
- **Nature & Animals** - Wildlife, Biology, Environment

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quizmaster-pro.git
   cd quizmaster-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage
- **Deployment**: Vercel

## 📱 Responsive Design

QuizMaster Pro is fully responsive and works seamlessly across:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🎯 How to Play

1. **Start**: Click "Start Quiz" from the home page
2. **Customize**: Adjust settings like timer, difficulty, and categories
3. **Answer**: Select your answer for each question
4. **Learn**: Read explanations after each question
5. **Progress**: Track your score and streak
6. **Achieve**: Unlock achievements and level up
7. **Analyze**: Review your performance in the Stats section

## 🏆 Achievement System

Unlock achievements by:
- Completing your first quiz
- Getting perfect scores
- Maintaining answer streaks
- Mastering specific categories
- Reaching level milestones
- Answering 100+ questions

## 🔧 Project Structure

```
quizmaster-pro/
├── app/                    # Next.js app directory
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── quiz-settings.tsx  # Quiz configuration
│   ├── user-stats.tsx     # Statistics display
│   └── developer-credits.tsx
├── data/                  # Static data
│   ├── questions.ts       # Question bank
│   └── achievements.ts    # Achievement definitions
├── hooks/                 # Custom React hooks
│   ├── use-local-storage.ts
│   └── use-sound.ts
├── types/                 # TypeScript type definitions
└── enhanced-quiz-app.tsx  # Main application component
```

## 🎨 Customization

### Adding New Questions
Edit `data/questions.ts` to add new questions:

```typescript
{
  id: 76,
  question: "Your question here?",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswer: 0,
  category: "YourCategory",
  difficulty: "easy",
  type: "multiple-choice",
  explanation: "Explanation of the answer",
  points: 10,
}
```

### Adding New Categories
1. Add category to `data/questions.ts`
2. Update the `categories` array
3. Add category-specific achievements if desired

## 📈 Performance Features

- **Local Storage**: Persistent user data and settings
- **Optimized Rendering**: Efficient React component updates
- **Responsive Images**: Optimized loading and display
- **Sound Management**: Optional audio feedback
- **Timer Optimization**: Accurate countdown functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Abhinav Tiwary**
- Engineering Student | Web Dev & AI Enthusiast
- Building real-world tech solutions
- [LinkedIn](https://www.linkedin.com/in/abhinav-tiwary-791a63302/)
- [GitHub](https://github.com/abhiii9vvv)

### Featured Projects
- 🔫 Weapon Detection System
- 💰 Price Tracker Website  
- 🎤 VoiceVerse Assistant

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

---

**[🎮 Play QuizMaster Pro Now!](https://v0-quiz-app-link.vercel.app/)**
```
