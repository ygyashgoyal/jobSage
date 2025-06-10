'use client'

import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Product Info */}
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase mb-4">JobSage</h2>
          <p className="text-sm text-gray-400">
            An AI-powered tool to analyze your resume and LeetCode profile to help you land your dream job.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase mb-4">Quick Links</h2>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-white transition">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-sm font-semibold text-gray-300 uppercase mb-4">Legal</h2>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/privacyPolicy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">Terms of Use</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()} JobSage. All rights reserved.
          </span>
          {/* Optional GitHub Link Only */}
          <div className="flex space-x-4 mt-4 md:mt-0">
  {/* GitHub */}
  <a
    href="https://github.com/ygyashgoyal"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    className="text-gray-400 hover:text-white transition"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.111.82-.261.82-.577 0-.285-.011-1.04-.017-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.3-5.467-1.334-5.467-5.933 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.63-5.48 5.922.43.372.823 1.103.823 2.222 0 1.604-.015 2.896-.015 3.29 0 .319.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z"
        clipRule="evenodd"
      />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="https://linkedin.com/in/yash-goyal-8642b1253"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="text-gray-400 hover:text-white transition"
  >
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.98 3.5C4.98 5 3.9 6 2.5 6S0 5 0 3.5 1.08 1 2.48 1 4.98 2 4.98 3.5zM.4 8h4.2v12H.4V8zm7.1 0h4v1.7h.06c.55-1.04 1.9-2.1 3.91-2.1 4.18 0 4.95 2.75 4.95 6.3V20h-4.2v-5.8c0-1.38-.02-3.15-1.92-3.15-1.92 0-2.22 1.5-2.22 3.05V20H7.5V8z" />
    </svg>
  </a>
</div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
