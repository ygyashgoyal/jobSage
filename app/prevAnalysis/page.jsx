'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import ChatbotPage from '../../components/Chatbot';

const formatKey = (key) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const PreviousAnalysis = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [summaries, setSummaries] = useState({});
  const [userId, setUserId] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => setShowChatbot((prev) => !prev);

  const fetchSummary = async (analysisResult, id) => {
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: analysisResult }),
      });

      const data = await response.json();
      if (response.ok && data.summary) {
        setSummaries((prev) => ({ ...prev, [id]: data.summary }));
      } else {
        setSummaries((prev) => ({
          ...prev,
          [id]: 'Summary not available.',
        }));
      }
    } catch {
      setSummaries((prev) => ({
        ...prev,
        [id]: 'Failed to generate summary.',
      }));
    }
  };

  const fetchAnalyses = async (user) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Failed to fetch analyses.');
        return;
      }

      const parsedData = data.map((item) => {
        let parsedInputData = item.input_data;
        try {
          if (typeof item.input_data === 'string') {
            parsedInputData = JSON.parse(item.input_data);
          }
        } catch {}
        return { ...item, parsedInputData };
      });

      setAnalyses(parsedData);

      parsedData.forEach((item) => {
        if (item.analysis_result) {
          fetchSummary(item.analysis_result, item.id);
        }
      });
    } catch (err) {
      setError('Unexpected error while fetching analyses.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError('You must be logged in to view your analyses.');
          return;
        }
        setUserId(user.id);
        await fetchAnalyses(user);
      } catch (err) {
        setError('Unexpected error getting user.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  function parseSummary(text) {
    if (!text) return [];
    const regex = /\*\*(.+?):\*\*([\s\S]*?)(?=(\*\*.+?:\*\*|$))/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        title: match[1].trim(),
        content: match[2].trim(),
      });
    }

    return matches;
  }

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.size} selected analysis(s)? This cannot be undone.`
      )
    )
      return;

    setDeleting(true);
    const idsToDelete = Array.from(selectedIds);

    const { error } = await supabase.from('analyses').delete().in('id', idsToDelete);

    if (error) {
      alert('Failed to delete analyses. Please try again.');
      setDeleting(false);
      return;
    }

    setAnalyses((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    setDeleting(false);
  };

  if (loading) return <div>Loading your previous analyses...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (analyses.length === 0) return <div>You have no saved analyses yet.</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10 text-white drop-shadow">
        Your Saved Analyses
      </h1>

      {selectedIds.size > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold shadow-md"
          >
            {deleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
          </button>
        </div>
      )}

      <ul className="space-y-8">
        {analyses.map((item) => {
          const analysis = item.parsedInputData || {};
          const isSelected = selectedIds.has(item.id);
          const summary = summaries[item.id];

          // Extracted ternary logic
          let displayJobTarget = 'Untitled Role';
          if (
            typeof analysis === 'object' &&
            analysis !== null &&
            analysis.job_target &&
            analysis.job_target.trim() !== ''
          ) {
            displayJobTarget = analysis.job_target;
          }

          return (
            <li
              key={item.id}
              className="p-6 border border-gray-200 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(item.id)}
                    className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                      {displayJobTarget}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Saved on:{' '}
                      <span className="font-medium text-gray-700">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-auto">
                  <details className="mt-4 md:mt-0">
                    <summary className="cursor-pointer font-medium text-blue-600 hover:underline">
                      View Summary
                    </summary>

                    <div className="mt-4 bg-gray-50 border border-gray-200 p-5 rounded-lg text-sm text-gray-700 whitespace-pre-line">
                      {parseSummary(summary).map(({ title, content }, index) => (
                        <div key={index} className="mb-5">
                          <div className="font-semibold text-gray-900 mb-1">{title}</div>
                          <div className="text-sm text-gray-700">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={toggleChatbot}
                        className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition duration-200 shadow"
                      >
                        {showChatbot ? 'Close Chat' : 'Open Chat'}
                      </button>
                    </div>

                    {showChatbot && (
                      <div className="mt-4">
                        <ChatbotPage
                          onClose={() => setShowChatbot(false)}
                          analysisData={{
                            id: item.id,
                            createdAt: item.created_at,
                            summary: parseSummary(summary),
                            ...analysis,
                          }}
                        />
                      </div>
                    )}
                  </details>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PreviousAnalysis;
