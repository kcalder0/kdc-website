export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-base">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-6 pt-16 pb-10">
        <div className="text-sm font-semibold text-white">Kyle Calder</div>
        <div className="text-xs text-white/50">
          © {year} · Built with Next.js
        </div>
      </div>
    </footer>
  );
}
