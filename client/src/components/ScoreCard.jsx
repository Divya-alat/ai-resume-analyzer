function ScoreCard({ score, summary }) {
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';

  return (
    <div className="scorecard">
      <h2>Your Resume Score</h2>
      <div className="score-ring" style={{ '--score-color': color }}>
        <div className="score-inner">
          <span className="score-num" style={{ color }}>{score}</span>
          <span className="score-total">/100</span>
          <span className="score-label" style={{ color }}>{label}</span>
        </div>
      </div>
      <p className="summary-text">{summary}</p>
    </div>
  );
}

export default ScoreCard;