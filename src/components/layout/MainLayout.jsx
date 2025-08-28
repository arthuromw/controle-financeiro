// FILE: src/components/layout/MainLayout.jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { signOut, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { /* ... */ };
  const closeSidebar = () => setSidebarVisible(false);

  return (
    <div className="app-container">
      <div 
        className={`overlay ${isSidebarVisible ? 'visible' : ''}`}
        onClick={closeSidebar}
      ></div>
      <Sidebar isVisible={isSidebarVisible} onClose={closeSidebar} />
      
      <div className="main-content">
        <header className="header">
          <button className="hamburger-button" onClick={() => setSidebarVisible(true)}>
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
            <span className="header-email">{currentUser?.email}</span>
            <button onClick={handleLogout} className="logout" style={{ marginLeft: '1rem' }}>
              Sair
            </button>
          </div>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}