// FILE: src/components/clients/ClientList.jsx
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ClientList({ clients, onEdit, onDelete }) {
  if (clients.length === 0) {
    return <p className="text-center text-gray-500">Nenhum cliente cadastrado ainda.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Nome</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Telefone</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{client.email || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">{client.phone || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onEdit(client)} className="mr-2 text-indigo-600 hover:text-indigo-900">
                  <FiEdit size={18} />
                </button>
                <button onClick={() => onDelete(client.id)} className="text-red-600 hover:text-red-900">
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