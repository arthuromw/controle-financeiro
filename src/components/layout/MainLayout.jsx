// FILE: src/components/layout/MainLayout.jsx
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
  const { signOut, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

return (
    // Aplicando a classe do container principal
    <div className="app-container">
      <Sidebar />
      {/* Aplicando a classe da área de conteúdo */}
      <div className="main-content">
        <header className="header">
          <span>{currentUser?.email}</span>
          <button onClick={handleLogout} className="logout">
            Sair
          </button>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}