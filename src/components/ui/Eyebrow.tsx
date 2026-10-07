/** Orange outlined pill used above each section heading. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-label-sm inline-flex items-center rounded-half border border-accent-orange/60 px-lg py-sm uppercase tracking-[0.08em] text-text-primary">
      {children}
    </span>
  );
}
