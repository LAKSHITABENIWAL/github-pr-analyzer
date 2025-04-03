import React, { useState } from 'react';

const PRAnalysis = ({ pr }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzePR = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/ai/analyze-pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          owner: pr.base.repo.owner.login,
          repo: pr.base.repo.name,
          pull_number: pr.number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze PR');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error analyzing PR:', err);
      setError(err.message || 'Failed to analyze PR. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    // Split the analysis into sections
    const sections = analysis.split('\n\n').filter(Boolean);

    return sections.map((section, index) => (
      <div key={index} style={styles.section}>
        {section.split('\n').map((line, lineIndex) => (
          <p key={lineIndex} style={getLineStyle(line)}>
            {line}
          </p>
        ))}
      </div>
    ));
  };

  const getLineStyle = (line) => {
    if (line.match(/^\d+\./)) {
      return styles.sectionHeader;
    }
    if (line.match(/^\s*-/)) {
      return styles.bulletPoint;
    }
    return styles.text;
  };

  return (
    <div style={styles.container}>
      {!analysis && !loading && (
        <button onClick={analyzePR} style={styles.analyzeButton}>
          <span style={styles.buttonIcon}>🤖</span>
          Analyze with AI
        </button>
      )}

      {loading && (
        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>
          Analyzing PR... This may take a few moments.
        </div>
      )}

      {error && (
        <div style={styles.error}>
          <span style={styles.errorIcon}>⚠️</span>
          {error}
        </div>
      )}

      {analysis && (
        <div style={styles.analysis}>
          <h4 style={styles.analysisTitle}>
            <span style={styles.aiIcon}>🤖</span> AI Analysis
          </h4>
          <div style={styles.analysisContent}>
            {renderAnalysis()}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '15px',
  },
  analyzeButton: {
    backgroundColor: '#238636',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2ea043',
    },
  },
  buttonIcon: {
    fontSize: '16px',
  },
  loading: {
    color: '#586069',
    fontSize: '14px',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loadingSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #e1e4e8',
    borderTopColor: '#0366d6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    color: '#cb2431',
    fontSize: '14px',
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#ffeef0',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  errorIcon: {
    fontSize: '16px',
  },
  analysis: {
    backgroundColor: '#f6f8fa',
    border: '1px solid #e1e4e8',
    borderRadius: '6px',
    padding: '16px',
    marginTop: '10px',
  },
  analysisTitle: {
    margin: '0 0 16px 0',
    color: '#24292e',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  aiIcon: {
    fontSize: '18px',
  },
  analysisContent: {
    fontSize: '14px',
    color: '#24292e',
    lineHeight: '1.5',
  },
  section: {
    marginBottom: '16px',
  },
  sectionHeader: {
    fontWeight: '600',
    margin: '8px 0',
  },
  bulletPoint: {
    margin: '4px 0 4px 16px',
  },
  text: {
    margin: '4px 0',
  },
};

// Add keyframes for the loading spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default PRAnalysis; 