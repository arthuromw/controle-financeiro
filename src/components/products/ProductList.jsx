// FILE: src/components/products/ProductList.jsx
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="text-center text-gray-500">Nenhum produto cadastrado ainda.</p>;
  }

  return (
    <div className="table-container overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Preço</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Estoque</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock} Un.</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onEdit(product)} className="mr-2 text-indigo-600 hover:text-indigo-900">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900">
                  <FiTrash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}