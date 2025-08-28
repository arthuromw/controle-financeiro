// FILE: src/components/sales/SaleForm.jsx
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';

// 1. Adicione 'isSaving' na lista de props que o componente recebe.
export default function SaleForm({ clients, products, onSave, onCancel, isSaving }) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Limpa o formulário quando o componente é montado ou a venda é salva
  useEffect(() => {
    setSelectedClientId('');
    setItems([]);
    setTotal(0);
  }, []);

  const calculateTotal = (currentItems) => {
    const newTotal = currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  };
  
  const handleAddProduct = (productId) => {
    if (!productId) return;

    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) return;
    
    const existingItem = items.find(item => item.id === productId);
    
    let updatedItems;
    if (existingItem) {
      updatedItems = items.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      const newItem = {
        id: productToAdd.id,
        name: productToAdd.name,
        price: productToAdd.price,
        quantity: 1
      };
      updatedItems = [...items, newItem];
    }
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };
  
  const updateItemQuantity = (productId, quantity) => {
    const newQuantity = Math.max(1, Number(quantity)); // Garante que a quantidade seja no mínimo 1
    
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSaving) return; // Impede submissão se já estiver salvando
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
      items,
      total,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      {/* SELEÇÃO DE CLIENTE */}
      <div>
        <h2>Dados da Venda</h2>
        <div style={{ marginTop: '1rem' }}>
            <label>Cliente</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              required
              disabled={isSaving}
            >
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
        </div>
      </div>

      {/* ADICIONAR PRODUTOS */}
      <div style={{ marginTop: '1.5rem' }}>
        <h2>Itens da Venda</h2>
         <div style={{ marginTop: '1rem' }}>
            <label>Adicionar Produto</label>
            <select
                onChange={(e) => handleAddProduct(e.target.value)}
                // Reseta o select para a opção padrão após adicionar um item
                value=""
                disabled={isSaving}
            >
              <option value="">Selecione um produto para adicionar...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </option>
              ))}
            </select>
        </div>
      </div>

      {/* LISTA DE ITENS ADICIONADOS */}
      <div style={{ marginTop: '1.5rem' }}>
        {items.length === 0 ? <p style={{ textAlign: 'center', color: '#666' }}>Nenhum item adicionado.</p> : (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th style={{width: '100px'}}>Qtd.</th>
                            <th style={{width: '120px'}}>Subtotal</th>
                            <th style={{width: '50px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>
                                    <input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                                        style={{ width: '80px', textAlign: 'center' }}
                                        min="1"
                                        disabled={isSaving}
                                    />
                                </td>
                                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</td>
                                <td>
                                    <button type="button" onClick={() => handleRemoveItem(item.id)} disabled={isSaving} style={{ background: 'none', color: 'var(--cor-erro)', boxShadow: 'none', padding: '0.5rem' }}>
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* TOTAL */}
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
        </h2>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button type="button" onClick={onCancel} style={{backgroundColor: '#a0aec0'}} disabled={isSaving}>
          Cancelar
        </button>
        {/* 2. Adiciona o estado 'disabled' e muda o texto enquanto salva. */}
        <button type="submit" disabled={isSaving} className="accent">
          {isSaving ? 'Salvando...' : 'Salvar Venda'}
        </button>
      </div>
    </form>
  );
}