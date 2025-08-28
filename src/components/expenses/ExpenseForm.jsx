// FILE: src/components/expenses/ExpenseForm.jsx
import { useState, useEffect } from 'react';

export default function ExpenseForm({ suppliers, onSave, onCancel, initialData }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setAmount(initialData.amount || '');
      setDueDate(initialData.dueDate || '');
      setSupplierId(initialData.supplierId || '');
    } else {
      setDescription('');
      setAmount('');
      setDueDate('');
      setSupplierId('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !dueDate) return alert("Preencha Descrição, Valor e Vencimento.");
    
    const supplierName = suppliers.find(s => s.id === supplierId)?.name || 'N/A';
    
    onSave({ 
        description, 
        amount: Number(amount), 
        dueDate,
        supplierId,
        supplierName 
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{initialData ? 'Editar Despesa' : 'Nova Despesa'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2" required />
        </div>
        <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700">Fornecedor (Opcional)</label>
            <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full mt-1 border rounded-md px-3 py-2">
                <option value="">Nenhum</option>
                {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                ))}
            </select>
        </div>
        <div className="md:col-span-4 flex justify-end gap-4 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-md">Salvar</button>
        </div>
      </form>
    </div>
  );
}