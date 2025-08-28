// FILE: src/components/layout/MainLayout.jsx
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
  const { signOut } = useAuth();
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-end h-16 px-6 bg-white shadow-md">
            <button onClick={handleLogout} className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600">
                Sair
            </button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}