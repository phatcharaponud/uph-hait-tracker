import { useState, useRef, useEffect } from 'react';

export default function ItemTooltip({ description }: { description: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-blue-400 hover:text-blue-600 transition-colors align-middle ml-1 text-xs cursor-help"
        aria-label="ดูคำอธิบาย"
      >
        ℹ️
      </button>
      {open && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-auto">
          <div className="leading-relaxed">{description}</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}
