// FILE: src/components/expenses/ExpenseList.jsx
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma despesa registrada.</p>;
  }
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3">Descrição</th>
            <th className="px-6 py-3">Vencimento</th>
            <th className="px-6 py-3">Fornecedor</th>
            <th className="px-6 py-3">Valor</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="px-6 py-4">{expense.description}</td>
              <td className="px-6 py-4">{new Date(expense.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
              <td className="px-6 py-4">{expense.supplierName || 'N/A'}</td>
              <td className="px-6 py-4 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount)}</td>
              <td className="px-6 py-4">
                <button onClick={() => onEdit(expense)} className="mr-2 text-indigo-600"><FiEdit size={18} /></button>
                <button onClick={() => onDelete(expense.id)} className="text-red-600"><FiTrash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}