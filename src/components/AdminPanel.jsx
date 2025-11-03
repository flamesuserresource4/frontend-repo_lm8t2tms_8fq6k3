import React, { useEffect, useMemo, useState } from 'react';
import { Download, PackagePlus, Trash2, Save } from 'lucide-react';

const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

const AdminPanel = () => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const [form, setForm] = useState({ barcode: '', name: '', price: '' });

  const addOrUpdate = () => {
    if (!form.barcode || !form.name || isNaN(parseFloat(form.price))) return;
    setProducts((prev) => {
      const exists = prev.find((p) => p.barcode === form.barcode);
      if (exists) {
        return prev.map((p) => (p.barcode === form.barcode ? { ...p, name: form.name, price: parseFloat(form.price) } : p));
      }
      return [...prev, { barcode: form.barcode, name: form.name, price: parseFloat(form.price) }];
    });
    setForm({ barcode: '', name: '', price: '' });
  };

  const remove = (barcode) => setProducts((prev) => prev.filter((p) => p.barcode !== barcode));

  const sales = useMemo(() => {
    const raw = localStorage.getItem('sales');
    return raw ? JSON.parse(raw) : [];
  }, []);

  const downloadCSV = () => {
    const rows = [
      ['Date', 'Items', 'Subtotal', 'Tax', 'Total'],
      ...sales.map((s) => [
        new Date(s.date).toISOString(),
        s.items.map((i) => `${i.name} x${i.qty}`).join('; '),
        s.subtotal,
        s.tax,
        s.total,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Admin • Products & Analytics</h3>
        <button
          type="button"
          onClick={downloadCSV}
          className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
        >
          <Download className="h-4 w-4" /> Download CSV
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-white/80">
              <PackagePlus className="h-4 w-4" /> Add or Update Product
            </div>
            <div className="space-y-2">
              <input
                value={form.barcode}
                onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}
                placeholder="Barcode"
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Name"
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <input
                value={form.price}
                type="number"
                min="0"
                step="0.01"
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="Price"
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={addOrUpdate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm"
              >
                <Save className="h-4 w-4" /> Save Product
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-3 text-sm text-white/80">Inventory</div>
            <div className="divide-y divide-white/10">
              {products.length === 0 && (
                <div className="rounded-md border border-white/10 p-4 text-sm text-white/70">No products added yet.</div>
              )}
              {products.map((p) => (
                <div key={p.barcode} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="truncate text-xs text-white/60">{p.barcode}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm tabular-nums">{currency(p.price)}</div>
                    <button
                      type="button"
                      onClick={() => remove(p.barcode)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-100"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
