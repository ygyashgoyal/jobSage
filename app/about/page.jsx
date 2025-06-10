import React from 'react'
import { Link } from 'lucide-react'

const page = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-blue-700">About JobSage</h1>

        <p className="text-lg mb-6">
          <strong>JobSage</strong> is your personalized career insight platform — built to help you understand where you stand and what you need to grow. Whether you're aiming for a dream job or trying to level up your LeetCode and resume game, JobSage gives you <span className="font-semibold">AI-powered analysis</span>, <span className="font-semibold">actionable feedback</span>, and <span className="font-semibold">trackable progress</span> — all in one place.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🎯 Our Mission</h2>
        <p className="mb-6">
          To empower students and job seekers with smart, tailored feedback — so they can focus on what actually matters, improve faster, and land the roles they deserve.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🔍 What JobSage Does</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li><strong>Resume Analyzer</strong> – Upload your resume, choose a dream role, and get precise AI feedback: missing skills, project gaps, keyword issues, and more.</li>
          <li><strong>LeetCode Analyzer</strong> – Paste your LeetCode profile, and we’ll break down your strengths, weaknesses, and suggest a roadmap.</li>
          <li><strong>Visual Progress Tracking</strong> – See your growth over time with saved analyses and visual reports.</li>
          <li><strong>Personalized Recommendations</strong> – Get YouTube videos, DSA topics, and job-specific skills recommended based on your profile.</li>
          <li><strong>Private and Secure</strong> – All your data is tied to your account. View history, delete anytime.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">👨‍💻 Why I Built JobSage</h2>
        <p className="mb-6">
          As a developer myself, I realized how hard it is to <em>self-assess</em> — especially when preparing for competitive job roles. JobSage is my attempt to simplify that process using AI and automation, and give students like me a clear edge in placement season and beyond.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🛠️ Tech Stack</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Frontend:</strong> Next.js, Tailwind CSS</li>
          <li><strong>Backend:</strong> Node.js, Supabase (Auth + DB), MongoDB (optional)</li>
          <li><strong>AI:</strong> Gemini API for analysis and feedback</li>
          <li><strong>Storage:</strong> Supabase PostgreSQL for history tracking</li>
        </ul>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-blue-700">Our Services</h1>

        <p className="text-lg mb-6">
          At <strong>JobSage</strong>, we provide a suite of smart, AI-powered services to help you take control of your career preparation. Whether you're submitting job applications or grinding on LeetCode, our tools give you deep insights and practical recommendations.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">📄 Resume Analysis</h2>
        <p className="mb-6">
          Upload your resume and specify your target job. Our AI evaluates the content and gives actionable feedback on missing skills, formatting issues, keyword mismatches, and overall effectiveness — helping you stand out in competitive job markets.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">💻 LeetCode Profile Review</h2>
        <p className="mb-6">
          Enter your LeetCode profile, and we’ll analyze your progress, identify weak areas, and suggest a focused path forward. We categorize problems and recommend what to practice next based on your current stats.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🎯 Smart Recommendations</h2>
        <p className="mb-6">
          For each analysis, we provide curated YouTube videos, DSA topics to revise, and job-specific keywords — helping you build the exact skills recruiters are looking for.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">📊 Progress Tracking</h2>
        <p className="mb-6">
          Every analysis is automatically saved to your history. Track how your resume or coding profile improves over time with clear visual feedback and data-backed insights.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600">🔐 User-Centric Storage</h2>
        <p className="mb-6">
          All your analysis data is securely stored and tied to your account. You can revisit previous analyses or delete them whenever you like — you stay in control of your data.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
  <h1 className="text-4xl font-bold mb-6 text-blue-700">Have Any Doubts?</h1>
  <a
    href="/contact"
    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
  >
    Contact Us
  </a>
</div>

    </>
  )
}

export default page
