import React from 'react';

const currency = (n) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);

const Cart = ({ items, onIncrement, onDecrement, onRemove, onClear, onCheckout }) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxRate = 0.07;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cart</h3>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="rounded-md border border-white/10 p-4 text-sm text-white/70">No items yet. Scan a product to add it.</div>
        )}
        {items.map((item) => (
          <div key={item.barcode} className="flex items-center justify-between rounded-md border border-white/10 p-3">
            <div>
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-white/60">{item.barcode}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm tabular-nums">{currency(item.price)}</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDecrement(item.barcode)}
                  className="rounded bg-white/10 px-2 py-1 text-sm"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => onIncrement(item.barcode)}
                  className="rounded bg-white/10 px-2 py-1 text-sm"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.barcode)}
                className="rounded bg-red-500/20 px-2 py-1 text-sm text-red-100"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
        <div className="text-white/70">Subtotal</div>
        <div className="text-right tabular-nums">{currency(subtotal)}</div>
        <div className="text-white/70">Tax (7%)</div>
        <div className="text-right tabular-nums">{currency(tax)}</div>
        <div className="border-t border-white/10 pt-2 font-semibold">Total</div>
        <div className="border-t border-white/10 pt-2 text-right text-base font-semibold tabular-nums">{currency(total)}</div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onCheckout({ subtotal, tax, total })}
          disabled={items.length === 0}
          className="rounded-md bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Checkout & Print
        </button>
      </div>
    </div>
  );
};

export default Cart;
