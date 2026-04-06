import { useState } from 'react';
import axios from 'axios';

function Upload({ setResult, setLoading }) {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert('Please upload a resume PDF!');
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobRole', jobRole || 'Software Developer');

    try {
      const res = await axios.post('https://ai-resume-analyzer-bzmp-dm95gfx1o-divya-alats-projects.vercel.app.vercel.app/api/analyze', formData);
      setResult(res.data);
    } catch (err) {
      alert('Analysis failed: ' + (err.response?.data?.error || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">

      <div
        className={`dropzone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          setFile(e.dataTransfer.files[0]);
        }}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file ? (
          <>
            <p className="drop-icon">✅</p>
            <p>{file.name}</p>
            <span>Click to change file</span>
          </>
        ) : (
          <>
            <p className="drop-icon">📄</p>
            <p>Drag & drop your resume here</p>
            <span>or click to browse · PDF only</span>
          </>
        )}
      </div>

      <p className="upload-title">🎯 Target Job Role</p>
      <div className="input-row">
        <input
          className="job-input"
          type="text"
          placeholder="e.g. React Developer, Full Stack Engineer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
        <button className="analyze-btn" onClick={handleSubmit}>
          <span>✨ Analyze</span>
        </button>
      </div>

    </div>
  );
}

export default Upload;