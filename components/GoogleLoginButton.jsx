import { supabase } from '../lib/supabaseClient';

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000', // fallback for SSR during development
      },
    });
    if (error) {
      alert('Login failed: ' + error.message);
    }
  };
  

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
    >
      Continue with Google
    </button>

  );
}
