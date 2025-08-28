// FILE: src/components/suppliers/SupplierList.jsx
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function SupplierList({ suppliers, onEdit, onDelete }) {
  if (suppliers.length === 0) {
    return <p className="text-center text-gray-500">Nenhum fornecedor cadastrado.</p>;
  }
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Contato</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Telefone</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="px-6 py-4">{supplier.name}</td>
              <td className="px-6 py-4">{supplier.contact || 'N/A'}</td>
              <td className="px-6 py-4">{supplier.phone || 'N/A'}</td>
              <td className="px-6 py-4">
                <button onClick={() => onEdit(supplier)} className="mr-2 text-indigo-600"><FiEdit size={18} /></button>
                <button onClick={() => onDelete(supplier.id)} className="text-red-600"><FiTrash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}