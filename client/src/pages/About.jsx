import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '70vh' }}>

      {/* HERO */}
      <div style={{ maxWidth: '900px', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
          About <span style={{ color: 'var(--primary)' }}>ShopEase</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          ShopEase is a modern full-stack e-commerce platform designed to deliver a
          smooth, fast, and intuitive shopping experience with a scalable backend and
          elegant UI.
        </p>
      </div>

      {/* GRID CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}
      >

        {/* FEATURES CARD */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
            🚀 Features
          </h2>

          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            <li>🛒 Persistent cart (localStorage)</li>
            <li>⚡ Fast product browsing</li>
            <li>🔍 Smart filtering system</li>
            <li>📦 Admin product control</li>
            <li>📱 Responsive UI design</li>
          </ul>
        </div>

        {/* TECH STACK CARD */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
            🛠️ Tech Stack
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            MongoDB<br />
            Express.js<br />
            React.js<br />
            Node.js<br /><br />
            Context API • REST APIs • JWT Auth • Local Storage Sync
          </p>
        </div>

        {/* MISSION CARD */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
            🎯 Mission
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            To build a seamless digital shopping experience with performance,
            simplicity, and scalability at its core.
          </p>
        </div>

      </div>
    </div>
  );
};

export default About;