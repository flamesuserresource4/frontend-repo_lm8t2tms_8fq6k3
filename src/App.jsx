import React, { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero';
import DevicePanel from './components/DevicePanel';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';

const mockLookup = (barcode, products) => {
  // Try local admin-defined products first
  const fromAdmin = products.find((p) => p.barcode === barcode);
  if (fromAdmin) return { name: fromAdmin.name, price: fromAdmin.price };

  // Fallback demo items
  const demo = {
    '012345678905': { name: 'Sparkling Water 500ml', price: 1.49 },
    '123456789012': { name: 'Chocolate Bar', price: 2.29 },
    '978020137962': { name: 'Notebook', price: 4.99 },
  };
  return demo[barcode] || { name: 'Unknown Item', price: 0 };
};

export default function App() {
  const [tab, setTab] = useState('cashier'); // 'cashier' | 'admin'
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const onStorage = () => {
      const saved = localStorage.getItem('products');
      setProducts(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addByBarcode = (barcode) => {
    const found = mockLookup(barcode, products);
    setCart((prev) => {
      const existing = prev.find((i) => i.barcode === barcode);
      if (existing) return prev.map((i) => (i.barcode === barcode ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { barcode, name: found.name, price: found.price, qty: 1 }];
    });
  };

  const increment = (barcode) => setCart((prev) => prev.map((i) => (i.barcode === barcode ? { ...i, qty: i.qty + 1 } : i)));
  const decrement = (barcode) =>
    setCart((prev) => prev.map((i) => (i.barcode === barcode ? { ...i, qty: Math.max(1, i.qty - 1) } : i)));
  const remove = (barcode) => setCart((prev) => prev.filter((i) => i.barcode !== barcode));
  const clear = () => setCart([]);

  const onCheckout = ({ subtotal, tax, total }) => {
    // Save a basic receipt locally for demo; in full app this would go to backend DB
    const sale = {
      date: Date.now(),
      items: cart,
      subtotal,
      tax,
      total,
    };
    const salesRaw = localStorage.getItem('sales');
    const sales = salesRaw ? JSON.parse(salesRaw) : [];
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));

    window.print();
    clear();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:py-10">
        <Hero />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('cashier')}
            className={`rounded-full px-4 py-2 text-sm ${tab === 'cashier' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            Cashier
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`rounded-full px-4 py-2 text-sm ${tab === 'admin' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            Admin
          </button>
        </div>

        {tab === 'cashier' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DevicePanel onSimulateScan={addByBarcode} />
            <Cart
              items={cart}
              onIncrement={increment}
              onDecrement={decrement}
              onRemove={remove}
              onClear={clear}
              onCheckout={onCheckout}
            />
          </div>
        ) : (
          <AdminPanel />
        )}

        <div className="text-center text-xs text-white/50">
          Note: This is a front-end demo. WebHID connections and data storage are local for now.
        </div>
      </div>
    </div>
  );
}
