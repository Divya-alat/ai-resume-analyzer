import { useState } from 'react';
import Upload from './components/Upload';
import ScoreCard from './components/ScoreCard';
import Suggestions from './components/Suggestions';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="app">
      <nav className="navbar">
        <span className="logo">🧾 ResumeAI</span>
        <span className="tagline">✨ Powered by AI</span>
      </nav>

      <header className="hero">
        <div className="hero-badge">🚀 AI-Powered Resume Analysis</div>
        <h1>Land Your Dream Job<br /><span>Faster with AI</span></h1>
        <p>Upload your resume and get an instant score, strengths, improvements & missing keywords</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">98%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="stat">
            <span className="stat-num">&lt;5s</span>
            <span className="stat-label">Analysis Time</span>
          </div>
          <div className="stat">
            <span className="stat-num">Free</span>
            <span className="stat-label">Always</span>
          </div>
        </div>
      </header>

      <main className="main">
        <Upload setResult={setResult} setLoading={setLoading} />
        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Analyzing your resume with AI...</p>
          </div>
        )}
        {result && !loading && (
          <>
            <ScoreCard score={result.score} summary={result.summary} />
            <Suggestions result={result} />
          </>
        )}
      </main>

      <footer className="footer">
        Built with ❤️ by <span>Divya Alat</span> · ENTC Engineer · Full Stack Developer
      </footer>
    </div>
  );
}

export default App;