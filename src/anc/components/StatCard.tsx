interface Props {
  label: string;
  value: number | string;
  caption: string;
  icon: string;
  gradient: string;
}

export default function StatCard({ label, value, caption, icon, gradient }: Props) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white p-5 shadow-md min-h-[150px] flex flex-col justify-between"
      style={{ background: gradient }}
    >
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl backdrop-blur-sm">
        <span aria-hidden>{icon}</span>
      </div>
      <div>
        <div className="text-sm/5 font-medium text-white/90">{label}</div>
        <div className="text-4xl font-bold leading-none mt-1">{value}</div>
        <div className="text-xs text-white/80 mt-2">{caption}</div>
      </div>
      <span
        aria-hidden
        className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10"
      />
    </div>
  );
}
