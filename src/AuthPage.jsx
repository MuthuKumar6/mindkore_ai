import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Sparkles, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import './AuthPage.css';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        if (!formData.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        result = await signup(formData.email, formData.password, formData.name);
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-orb auth-orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="auth-logo-glow"></div>
              <div className="auth-logo-icon">
                <Sparkles size={32} />
              </div>
            </div>
            <h1 className="auth-title">MindKore AI</h1>
            <p className="auth-subtitle">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              <div className="auth-button-gradient"></div>
              <span className="auth-button-content">
                {loading ? (
                  <>
                    <Loader2 size={20} className="loading-spinner" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                )}
              </span>
            </button>
          </form>

          <div className="auth-footer">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '' });
              }}
              className="auth-switch"
            >
              {isLogin ? (
                <>
                  Don't have an account? <span>Sign up</span>
                </>
              ) : (
                <>
                  Already have an account? <span>Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="auth-features">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>AI-Powered</h3>
            <p>Advanced conversations with MindKore AI</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Your data is encrypted and protected</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Smart Chat</h3>
            <p>Context-aware conversations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;