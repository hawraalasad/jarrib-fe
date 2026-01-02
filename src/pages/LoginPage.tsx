import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <span className="font-arabic text-4xl font-semibold text-indigo">جرّب</span>
        </Link>

        {/* Card */}
        <div className="card p-8">
          <h1 className="font-display text-2xl font-semibold text-deep-violet text-center mb-2">
            Welcome Back
          </h1>
          <p className="font-ui text-lavender text-center mb-8">
            Log in to access your saved classes
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 text-error rounded-lg text-sm font-ui">
                {error}
              </div>
            )}

            <div>
              <label className="block font-ui text-sm text-deep-violet mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input"
              />
            </div>

            <div>
              <label className="block font-ui text-sm text-deep-violet mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="font-ui text-sm text-lavender text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
