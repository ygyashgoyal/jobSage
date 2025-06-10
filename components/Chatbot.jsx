'use client';

import { useEffect, useRef, useState } from 'react';
import { getAIResponse } from '../lib/genaiClient';
import ReactMarkdown from 'react-markdown'

function AutoResizeTextarea({ value, onChange, onKeyDown, placeholder, disabled }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      className="flex-grow min-w-0 resize-none overflow-hidden border rounded p-2 text-sm focus:outline-none focus:ring"
    />
  );
}

export default function Chatbot({ onClose, analysisData = {} }) {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const replyText = await getAIResponse(input, analysisData);
      const aiMessage = { sender: 'ai', text: replyText };
      setChat((prev) => [...prev, aiMessage]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: 'ai', text: 'Something went wrong while processing your request.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(analysisData).length > 0 && chat.length === 0) {
      setChat([
        {
          sender: 'ai',
          text: `Hi! I've reviewed your profile for the role of **${analysisData.job_target || 'a position'}**. Ask me anything about your skills, missing areas, or how to improve! 📊`,
        },
      ]);
    }
  }, [analysisData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  return (
    <div className="fixed bottom-4 right-4 bg-white/60 backdrop-blur-lg shadow-2xl border border-gray-300 rounded-2xl w-full max-w-md h-[80vh] p-4 z-50 flex flex-col text-gray-900 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 border-b border-purple-100 pb-2">
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          🧠 Smart Chatbot
        </h2>
        <button
          onClick={onClose}
          className="text-xs text-red-500 hover:text-red-700 transition"
        >
          ✖ Close
        </button>
      </div>
  
      {/* Chat history */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scroll mb-3">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[75%] text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <ReactMarkdown>
              {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-1 ml-2">
            <div className="dot w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            <div className="dot w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
            <div className="dot w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
  
      {/* Input */}
      <div className="flex items-end w-full gap-2 mt-1">
        <AutoResizeTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          disabled={loading}
          className="w-full resize-none p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-sm bg-white"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-semibold"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
  
}
