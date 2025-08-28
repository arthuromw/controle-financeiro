// FILE: src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';

export default function Sidebar({ isVisible, onClose }) {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Produtos', href: '/products' },
    { name: 'Clientes', href: '/clients' },
    { name: 'Fornecedores', href: '/suppliers' },
    { name: 'Vendas', href: '/sales' },
    { name: 'Despesas', href: '/expenses' },
    { name: 'Financeiro', href: '/financial' },
    { name: 'Relatórios', href: '/reports' },
  ];

  const sidebarClasses = `sidebar ${isVisible ? 'visible' : ''}`;

  return (
    <div className={sidebarClasses}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="sidebar-title">Meu Financeiro</h2>
        <button className="hamburger-button" onClick={onClose} style={{ fontSize: '1.5rem', display: 'block' }}>
          &times;
        </button>
      </div>
      <nav className="sidebar-nav" onClick={onClose}>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            // Adiciona a classe 'active' dinamicamente
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}