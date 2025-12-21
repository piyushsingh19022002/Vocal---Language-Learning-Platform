import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="not-found-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '72px', color: '#cbd5e1', marginBottom: '24px' }}>404</h1>
        <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '400px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          style={{ 
            backgroundColor: '#2563eb', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'background 0.2s'
          }}
        >
          Go Back Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
