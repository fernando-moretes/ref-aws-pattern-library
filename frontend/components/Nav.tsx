import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-cyan-400">
          AWS Pattern Library
        </Link>
        <ul className="flex flex-wrap gap-5 text-sm text-slate-300">
          <li>
            <Link href="/patterns" className="hover:text-cyan-300">
              Patterns
            </Link>
          </li>
          <li>
            <Link href="/compare" className="hover:text-cyan-300">
              Compare
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/fernandofatech/aws-pattern-library"
              className="rounded-md border border-slate-700 px-3 py-1 hover:bg-slate-900"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
