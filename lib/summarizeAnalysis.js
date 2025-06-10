// lib/summarizeAnalysis.js
export const summarizeAnalysis = async (analysis) => {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis }),
    });
  
    const data = await response.json();
    return data.summary;
  };
  