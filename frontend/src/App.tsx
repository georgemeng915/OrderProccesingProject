import { useState, useEffect } from 'react';
import './App.css';

// 1. UPDATED INTERFACE: Must match your Java backend's JSON exactly
interface Order {
  orderId?: string;
  itemSku: string;
  quantity: number;
  totalPrice: number;
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  // Fetch orders from Spring Boot backend on load
  const fetchOrders = async () => {
    try {
      // Note: Ensure this URL matches what you configured in Java.
      // If you removed '/api' from Java earlier, change this to 'http://localhost:8080/orders'
      const response = await fetch('http://localhost:8080/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = {
      itemSku: item,
      quantity: Number(quantity),
      totalPrice: Number(price),
      status: "PENDING"
    };

    try {
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        setItem('');
        setQuantity(1);
        setPrice(0);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h1>📦 Order Processing Dashboard</h1>

        {/* Order Creation Form */}
        <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Create New Order</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Item Name:</label>
            <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                required
                style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Quantity:</label>
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Price ($):</label>
            <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" style={{ background: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Submit Order
          </button>
        </form>

        {/* Orders List Table */}
        <h3>Existing Orders</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
          <tr style={{ background: '#007bff', color: 'white' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Item</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quantity</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
          </tr>
          </thead>
          <tbody>
          {orders.length > 0 ? (
              orders.map((order, index) => (
                  // 2. UPDATED TABLE MAPPING: Using orderId, itemSku, and totalPrice
                  <tr key={order.orderId || index}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.orderId || index + 1}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.itemSku || 'N/A'}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{order.quantity}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>${(order.totalPrice || 0).toFixed(2)}</td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan={4} style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>
                  No orders found.
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
}

export default App;