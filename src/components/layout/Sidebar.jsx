// FILE: src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';

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

export default function Sidebar() {
  return (
    // Aplicando a classe da sidebar
    <div className="sidebar">
      <h2 className="sidebar-title">Meu Financeiro</h2>
      {/* Aplicando a classe do container de navegação */}
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            // O NavLink já adiciona a classe 'active' por padrão, o CSS cuidará disso
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}