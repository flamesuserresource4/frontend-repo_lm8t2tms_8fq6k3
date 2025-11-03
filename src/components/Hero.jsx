import React from 'react';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[420px] overflow-hidden rounded-2xl bg-black">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/zks9uYILDPSX-UX6/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Gradient overlay for readability without blocking interaction */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-10 text-white md:py-16">
        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">POS • WebHID • PWA</span>
        <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
          Futuristic POS with Barcode Scanning & Receipt Printing
        </h1>
        <p className="max-w-2xl text-sm text-white/80 md:text-base">
          Scan products, manage inventory, and print receipts — all in your browser. Real-time device
          status powered by the WebHID API.
        </p>
      </div>
    </section>
  );
};

export default Hero;
