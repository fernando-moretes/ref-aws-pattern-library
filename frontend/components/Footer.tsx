export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl border-t border-slate-800 px-6 py-8 text-sm text-slate-400">
      <p>
        Built by{" "}
        <a className="text-cyan-300 hover:underline" href="https://fernando.moretes.com">
          Fernando Francisco Azevedo
        </a>{" "}
        ·{" "}
        <a
          className="text-cyan-300 hover:underline"
          href="https://www.linkedin.com/in/fernando-francisco-azevedo/"
        >
          LinkedIn
        </a>{" "}
        ·{" "}
        <a className="text-cyan-300 hover:underline" href="https://github.com/fernandofatech">
          GitHub
        </a>
      </p>
      <p className="mt-2">MIT License · © 2026 · Patterns are illustrative; verify pricing with AWS.</p>
    </footer>
  );
}
