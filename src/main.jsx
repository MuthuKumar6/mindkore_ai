import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AuthPage from './AuthPage.jsx'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import { Loader2 } from 'lucide-react'
import './index.css'

function AppWrapper() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0a0a0f',
        color: '#8b5cf6'
      }}>
        <Loader2 size={40} className="loading-spinner" />
      </div>
    );
  }
  
  return isAuthenticated ? <App /> : <AuthPage />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </React.StrictMode>,
)