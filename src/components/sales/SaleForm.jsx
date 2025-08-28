// FILE: src/components/sales/SaleForm.jsx
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

export default function SaleForm({ clients, products, onSave, onCancel }) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState([]); // Array com os produtos da venda
  const [total, setTotal] = useState(0);

  const handleAddProduct = (productId) => {
    if (!productId) return;

    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;
    
    // Verifica se o item já está na lista para apenas incrementar a quantidade
    const existingItem = items.find(item => item.id === productId);
    if (existingItem) {
      updateItemQuantity(productId, existingItem.quantity + 1);
    } else {
      const newItem = {
        id: productToAdd.id,
        name: productToAdd.name,
        price: productToAdd.price,
        quantity: 1
      };
      setItems([...items, newItem]);
    }
    calculateTotal([...items, { ...productToAdd, quantity: 1 }]);
  };
  
  const updateItemQuantity = (productId, quantity) => {
    const newQuantity = Number(quantity);
    if (newQuantity < 1) return; // Não permite quantidade menor que 1
    
    const updatedItems = items.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };
  
  const handleRemoveItem = (productId) => {
    const updatedItems = items.filter(item => item.id !== productId);
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };
  
  const calculateTotal = (currentItems) => {
    const newTotal = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert('Por favor, selecione um cliente.');
      return;
    }
    if (items.length === 0) {
      alert('Adicione pelo menos um produto à venda.');
      return;
    }

    const clientName = clients.find(c => c.id === selectedClientId)?.name;

    onSave({
      clientId: selectedClientId,
      clientName,
      items, // Salva a lista de itens
      total,
      status: 'Pendente',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-6">
      {/* SELEÇÃO DE CLIENTE */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded-md"
          required
        >
          <option value="">Selecione um cliente</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      {/* ADICIONAR PRODUTOS */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Adicionar Produto</label>
        <select
            onChange={(e) => handleAddProduct(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            defaultValue=""
        >
          <option value="">Selecione um produto para adicionar</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</option>
          ))}
        </select>
      </div>

      {/* LISTA DE ITENS ADICIONADOS */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Itens da Venda</h3>
        {items.length === 0 ? <p className="text-gray-500">Nenhum item adicionado.</p> : (
            <div className="border rounded-md">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <span>{item.name}</span>
                        <div className="flex items-center gap-4">
                            <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                className="w-20 text-center border rounded-md"
                                min="1"
                            />
                            <span>x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</span>
                            <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* TOTAL */}
      <div className="text-right">
        <h2 className="text-2xl font-bold">Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</h2>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Salvar Venda
        </button>
      </div>
    </form>
  );
}