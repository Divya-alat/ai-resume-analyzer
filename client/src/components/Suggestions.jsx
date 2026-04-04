function Suggestions({ result }) {
  return (
    <div className="suggestions">
      <div className="card card-green">
        <h3>✅ Strengths</h3>
        <ul>
          {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="card card-orange">
        <h3>🔧 Areas to Improve</h3>
        <ul>
          {result.improvements.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="card card-red">
        <h3>🔑 Missing Keywords</h3>
        <div className="keywords">
          {result.missingKeywords.map((k, i) => (
            <span key={i} className="keyword-tag">{k}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Suggestions;