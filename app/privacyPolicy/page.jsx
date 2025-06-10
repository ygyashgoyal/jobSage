export default function PrivacyPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Privacy Policy</h1>
  
        <p className="mb-4">
          JobSage ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-600">1. Information We Collect</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Email address (via Google Authentication)</li>
          <li>Uploaded resumes and LeetCode usernames</li>
          <li>Optional input like job role preferences</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-600">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside mb-4">
          <li>To generate personalized job readiness analysis</li>
          <li>To provide recommendations on skills and preparation</li>
          <li>To improve and personalize your experience</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-600">3. Third-Party Services</h2>
        <p className="mb-4">
          We use third-party services such as Google Authentication, Supabase, and optionally OpenAI APIs to enhance functionality. These services may process user data under their own policies.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-600">4. Data Security</h2>
        <p className="mb-4">
          We use industry-standard practices to protect your data. However, no method of transmission over the internet is 100% secure.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-600">5. Your Rights</h2>
        <p className="mb-4">
          You can request deletion of your data by contacting us. We do not sell your data.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2 text-blue-600">6. Contact Us</h2>
        <p>
          For questions or data removal requests, email us at <a href="mailto:yashgoyal2k5@gmail.com" className="text-blue-600 underline">yashgoyal2k5@gmail.com</a>.
        </p>
      </div>
    );
  }
  