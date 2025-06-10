'use client'

import React, { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', form)
    alert('Message sent successfully!')
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div
        className="bg-black text-white p-8 flex flex-col justify-center"
        style={{
          backgroundImage: "url('/your-bg-image.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-black bg-opacity-70 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          <div className="mb-4">
            <p className="font-medium">📍 Address</p>
            <p>Rohini, New Delhi - 110086</p>
          </div>
          <div>
            <p className="font-medium">📧 General Support</p>
            <a href="mailto:yashgoyal2k5@gmail.com">
              <p className="text-green-400">yashgoyal2k5@gmail.com</p>
            </a>
          </div>

          <div className="mt-6">
            <p className="font-medium mb-2">🌐 Online Profiles</p>
            <ul className="space-y-1 text-green-400">
              <li>
                <a
                  href="https://portfolio-yash-goyal-six.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌟 My Portfolio
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ygyashgoyal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💻 GitHub Link
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/yash-goyal-8642b1253/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔗 LinkedIn Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold mb-6 text-white">Send Us A Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              required
              className="w-1/2 p-3 border rounded text-white"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              required
              className="w-1/2 p-3 border rounded text-white"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded text-white"
          />
          <input
            type="text"
            name="phone"
            placeholder="+1 800 000000"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded text-white"
          />
          <textarea
            name="message"
            placeholder="Write us a message"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded h-32 text-white"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  )
}
