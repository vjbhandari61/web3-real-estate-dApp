import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary p-6 border-b border-accent">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-accent">CINEMATIC</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-text hover:text-accent">Home</Link>
          <Link href="/about" className="text-text hover:text-accent">About</Link>
          <Link href="/contact" className="text-text hover:text-accent">Contact</Link>
        </nav>
      </div>
    </header>
  );
}