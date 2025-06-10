'use client'

import { useEffect, useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack'; // Importing pdf.js library for extracting text from PDFs
import { supabase } from '../../lib/supabaseClient';
import ReactMarkdown from 'react-markdown'

const page = () => {
  // State to store the dream job entered by the user
  const [dreamJob, setDreamJob] = useState('');
  // State to store the extracted resume text
  const [resumeText, setResumeText] = useState('');
  // State to handle loading status
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [skipLeetcode, setSkipLeetcode] = useState(false);
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState(null); // for /api/leetcode
  const [analysisData, setAnalysisData] = useState(null); // for /api/analyze_leetcode
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  /**
   * Handles file upload, extracts text from the uploaded PDF file, and updates the resume text state.
   * @param {Object} e - The file input change event
   */

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    setProfileData(null);
    setAnalysisData(null);

    try {
      const [res, res2] = await Promise.all([
        fetch(`/api/leetcode?username=${username}`),
        fetch('/api/analyze_leetcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        }),
      ]);

      const json = await res.json();
      const result = await res2.json();

      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      if (!res2.ok) throw new Error(result.error || 'Something went wrong');

      setProfileData(json);
      setAnalysisData(result);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large (max 5MB).");
      return;
    }

    if (file && file.type === 'application/pdf') {
      setIsExtracting(true);
      setResumeText('');
      try {
        const reader = new FileReader();
        reader.onload = async function () {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let text = ''; 

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(' ');
            text += pageText + '\n';
          }

          setResumeText(text);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        alert('Error extracting text from the PDF. Please try again.');
      } finally {
        setIsExtracting(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  /**
   * Handles form submission, logs the user inputs (dream job and resume text),
   * and can be extended to send data for further analysis or recommendations.
   * @param {Object} e - The form submit event
   */
  const handleSubmit = async (e) => {
    console.log("Hey there");
    e.preventDefault();
    setIsAnalyzing(true);
    setLoading(true);
    setError(' ');
    if (!dreamJob || !resumeText) {
      alert("Please fill out all fields before submitting.");
      return;
    }


    try {

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamJob, resumeText }),
      });

      const data = await response.json();
      if (!skipLeetcode) {
        await fetchProfile();
      }
      setAnalysisResult(data.analysis); // Store AI analysis result

    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalysisResult("An error occurred while analyzing the resume.");
    } finally {
      setIsAnalyzing(false);
      setLoading(false);
    }
  };

  const saveAnalysis = async () => {
    try {
      if (!analysisResult) {
        alert('No resume analysis to save yet!');
        return;
      }
  
      const combinedAnalysis = {
        resume_analysis: analysisResult,
        job_target: dreamJob,
        timestamp: new Date().toISOString(),
      };
  
      if (profileData) {
        combinedAnalysis.leetcode_profile_analysis = profileData;
      }
  
      if (analysisData) {
        combinedAnalysis.leetcode_dsa_coaching = analysisData;
      }
  
      // 1. Get summary from /api/summarize
      const summaryResponse = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: combinedAnalysis }),
      });
  
      if (!summaryResponse.ok) {
        const errJson = await summaryResponse.json().catch(() => null);
        console.error('Summary API failed:', errJson || summaryResponse.statusText);
        alert('Failed to generate summary. Save aborted.');
        return;
      }
  
      const { summary } = await summaryResponse.json();
  
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const token = session?.access_token;
  
      if (sessionError || !token) {
        console.error('Supabase session error:', sessionError);
        alert('You must be logged in to save analysis.');
        return;
      }
  
      const saveResponse = await fetch('/api/saveAnalysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          analysis_type: 'job_analysis', 
          input_data: combinedAnalysis,
          analysis_result: summary,
        }),
      });
      
  
      if (!saveResponse.ok) {
        let errJson = null;
        try {
          errJson = await saveResponse.json();
        } catch (e) {
          errJson = null;
        }
        console.error('Failed to save analysis:', errJson || await saveResponse.text());
        alert('Save failed.');
      } else {
        alert('Analysis and summary saved successfully!');
      }
      
    } catch (err) {
      console.error('Unexpected error in saveAnalysis:', err);
      alert('Something went wrong. Check console.');
    }
  };
  
  


  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        New Analysis
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800"
      >
        {/* Dream Job */}
        <div>
          <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
            Your Dream Job
          </label>
          <input
            type="text"
            value={dreamJob}
            onChange={(e) => setDreamJob(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition duration-150 ease-in-out"
            placeholder="e.g., Software Engineer at Google"
            required
          />
        </div>

        {/* Resume Upload */}
        <div>
          <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
            Upload Your Resume (PDF)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none transition duration-150 ease-in-out"
          />
        </div>

        {/* Skip LeetCode Option */}
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            id="skipLeetcode"
            checked={skipLeetcode}
            onChange={() => setSkipLeetcode(!skipLeetcode)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="skipLeetcode"
            className="ml-3 text-sm text-gray-700 dark:text-gray-300"
          >
            Skip LeetCode Profile Analysis
          </label>
        </div>

        {/* Username Input */}
        {!skipLeetcode && (
          <div>
            <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
              LeetCode Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., johndoe123"
              className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition duration-150 ease-in-out"
            />
            {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 px-4 rounded-lg font-semibold transition-all"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {/* Resume Preview */}
      {resumeText && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
            Resume Preview
          </h2>
          <div className="space-y-6 bg-white dark:bg-gray-900 text-black dark:text-white shadow-md p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            {resumeText
              .split(/(?=Education|Experience|Skills|Projects|Certifications|Summary)/gi)
              .map((section, index) => (
                <div key={index} className="border-b border-gray-300 dark:border-gray-600 pb-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {section.split('\n')[0]}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {section.split('\n').slice(1).join('\n').trim()}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
            AI Analysis Result
          </h2>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md text-black dark:text-white prose dark:prose-invert max-w-none">
            {<ReactMarkdown
              components={{
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-6" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal ml-6" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-black dark:text-white" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-800 dark:text-gray-300" {...props} />
                )
              }}
            >
              {analysisResult}
            </ReactMarkdown>}
          </div>
        </div>
      )}




      {/* LeetCode DSA Stats */}
      {analysisResult && profileData && (
        <div className="max-w-3xl mx-auto p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mt-10">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">DSA Stats</h2>
          <h3 className="text-xl font-semibold mb-3 text-blue-700 dark:text-blue-400">
            {profileData.matchedUser.username}'s Stats
          </h3>
          <p className="mb-1">Ranking: <span className="font-medium">{profileData.matchedUser.profile.ranking}</span></p>
          <p className="mb-3">Reputation: <span className="font-medium">{profileData.matchedUser.profile.reputation}</span></p>
          <div className="flex flex-wrap gap-3 mb-4">
            {profileData.matchedUser.submitStats.acSubmissionNum.map((item) => (
              <span
                key={item.difficulty}
                className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium transition"
              >
                {item.difficulty}: {item.count}
              </span>
            ))}
          </div>
          {profileData.userContestRanking && (
            <div className="mt-4 space-y-1 text-gray-700 dark:text-gray-300">
              <p>Contest Rating: <span className="font-semibold">{profileData.userContestRanking.rating}</span></p>
              <p>Global Rank: <span className="font-semibold">{profileData.userContestRanking.globalRanking}</span></p>
            </div>
          )}
        </div>
      )}

      {/* Topic-wise Analysis */}
      {analysisData && (
        <div className="max-w-3xl mx-auto p-6 rounded-xl shadow-md bg-yellow-100 dark:bg-gray-900 mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-900 dark:text-yellow-200">
            Topic-wise Problem Solving
          </h2>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Fundamental Topics:</h3>
            {analysisData.fundamental.map((tag) => (
              <p key={tag.tagName} className="mb-1">
                <span className="font-medium">{tag.tagName}</span>: {tag.problemsSolved}
              </p>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Intermediate Topics:</h3>
            {analysisData.intermediate.map((tag) => (
              <p key={tag.tagName} className="mb-1">
                <span className="font-medium">{tag.tagName}</span>: {tag.problemsSolved}
              </p>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Advanced Topics:</h3>
            {analysisData.advanced.map((tag) => (
              <p key={tag.tagName} className="mb-1">
                <span className="font-medium">{tag.tagName}</span>: {tag.problemsSolved}
              </p>
            ))}
          </div>

          {analysisData?.aiInsights && (
            <div className="mt-8 p-6 dark:bg-blue-900 text-white rounded-xl shadow space-y-4 leading-relaxed">
              <h3 className="text-xl font-semibold mb-4">AI-Powered Career Insights</h3>

              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-3" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-2 text-lime-300" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-base font-semibold mt-2 text-yellow-200" {...props} />,
                  p: ({ node, ...props }) => <p className="text-white" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc ml-6 space-y-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal ml-6 space-y-1" {...props} />,
                  li: ({ node, ...props }) => <li {...props} />,
                }}
              >
                {analysisData.aiInsights}
              </ReactMarkdown>
            </div>
          )}

        </div>
      )}


      {analysisResult && (
        <button
          onClick={saveAnalysis}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-lg font-semibold transition duration-150"
        >
          Save Analysis
        </button>
      )}





      {/* Loader */}
      {isExtracting && (
        <div className="mt-6 text-center text-gray-800 dark:text-gray-300">
          <p>Extracting text from the resume, please wait...</p>
        </div>
      )}
    </div>

  );
};

export default page;