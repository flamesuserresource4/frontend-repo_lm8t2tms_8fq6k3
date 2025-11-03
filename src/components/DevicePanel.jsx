import React, { useEffect, useMemo, useState } from 'react';
import { Usb, Barcode, Printer, PlugZap } from 'lucide-react';

const friendlyStatus = (connected) => (connected ? 'Connected' : 'Disconnected');

const DevicePanel = ({ onSimulateScan }) => {
  const [hidSupported, setHidSupported] = useState(false);
  const [scannerConnected, setScannerConnected] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);

  useEffect(() => {
    setHidSupported(!!navigator.hid);

    if (!navigator.hid) return;

    // On load, check already granted devices
    navigator.hid.getDevices().then((devices) => {
      const hasScanner = devices.some((d) => /scanner|barcode|hid/i.test(d.productName || ''));
      const hasPrinter = devices.some((d) => /printer|receipt/i.test(d.productName || ''));
      setScannerConnected(hasScanner);
      setPrinterConnected(hasPrinter);
    });

    const handleConnect = (e) => {
      const name = (e.device?.productName || '').toLowerCase();
      if (name.includes('printer') || name.includes('receipt')) setPrinterConnected(true);
      if (name.includes('scanner') || name.includes('barcode')) setScannerConnected(true);
    };

    const handleDisconnect = (e) => {
      const name = (e.device?.productName || '').toLowerCase();
      if (name.includes('printer') || name.includes('receipt')) setPrinterConnected(false);
      if (name.includes('scanner') || name.includes('barcode')) setScannerConnected(false);
    };

    navigator.hid.addEventListener('connect', handleConnect);
    navigator.hid.addEventListener('disconnect', handleDisconnect);
    return () => {
      navigator.hid.removeEventListener('connect', handleConnect);
      navigator.hid.removeEventListener('disconnect', handleDisconnect);
    };
  }, []);

  const requestScanner = async () => {
    if (!navigator.hid) return;
    try {
      const devices = await navigator.hid.requestDevice({ filters: [] });
      const picked = devices?.[0];
      if (picked) {
        const name = (picked.productName || '').toLowerCase();
        if (name.includes('scanner') || name.includes('barcode')) setScannerConnected(true);
      }
    } catch (e) {
      // user canceled
    }
  };

  const requestPrinter = async () => {
    if (!navigator.hid) return;
    try {
      const devices = await navigator.hid.requestDevice({ filters: [] });
      const picked = devices?.[0];
      if (picked) {
        const name = (picked.productName || '').toLowerCase();
        if (name.includes('printer') || name.includes('receipt')) setPrinterConnected(true);
      }
    } catch (e) {
      // user canceled
    }
  };

  const [simBarcode, setSimBarcode] = useState('');

  const canSimulate = useMemo(() => simBarcode.trim().length > 0, [simBarcode]);

  const handleSimulate = () => {
    if (!canSimulate) return;
    const code = simBarcode.trim();
    onSimulateScan?.(code);
    setSimBarcode('');
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="mb-4 flex items-center gap-2">
        <Usb className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Devices</h3>
      </div>

      {!hidSupported ? (
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-200">
          Your browser does not support the WebHID API. Use the latest Chrome or Edge.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Barcode className="h-5 w-5" />
                <span className="font-medium">Barcode Scanner</span>
              </div>
              <span className={`text-xs ${scannerConnected ? 'text-emerald-300' : 'text-red-300'}`}>
                {friendlyStatus(scannerConnected)}
              </span>
            </div>
            <button
              type="button"
              onClick={requestScanner}
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            >
              Connect Scanner
            </button>
          </div>

          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                <span className="font-medium">Receipt Printer</span>
              </div>
              <span className={`text-xs ${printerConnected ? 'text-emerald-300' : 'text-red-300'}`}>
                {friendlyStatus(printerConnected)}
              </span>
            </div>
            <button
              type="button"
              onClick={requestPrinter}
              className="w-full rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            >
              Connect Printer
            </button>
          </div>

          <div className="rounded-lg border border-white/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlugZap className="h-5 w-5" />
                <span className="font-medium">Simulate Scan</span>
              </div>
              <span className="text-xs text-white/70">Testing</span>
            </div>
            <div className="flex gap-2">
              <input
                value={simBarcode}
                onChange={(e) => setSimBarcode(e.target.value)}
                placeholder="Enter barcode"
                className="flex-1 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={handleSimulate}
                disabled={!canSimulate}
                className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicePanel;
