export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-bone/10 bg-ink py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left lg:px-10">
        <div className="flex items-center gap-3">
          <span className="block h-2 w-2 rotate-45 bg-gold" />
          <span className="font-display text-lg font-black tracking-[0.3em] text-bone">
            OBSIDIAN
          </span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-faint">
          [ endereço · horário · cidade — em breve ]
        </p>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint">
          © {new Date().getFullYear()} · Arte na pele
        </p>
      </div>
    </footer>
  );
}
