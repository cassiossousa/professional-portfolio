import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="font-semibold">Cássio dos Santos Sousa</p>

          <p className="text-sm text-gray-500 mt-1">Staff Software Engineer</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex gap-6 text-sm">
            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>

            <li>
              <a
                href="https://github.com/cassiossousa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </li>

            <li>
              <a
                href="https://linkedin.com/in/cassiossousa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>

        <p className="text-sm text-gray-500">© {year} Cássio Sousa</p>
      </div>
    </footer>
  );
}
