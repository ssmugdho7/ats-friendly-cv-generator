import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

const Header = () => {
    return (
        <header className="mx-auto flex max-w-screen-2xl items-center border-b border-gray-700/30 px-4 py-3 lg:px-6">
            <Link href={'/'} className="mr-auto text-xl font-bold tracking-tight">
                <span className="text-gradient">Resumave</span>
            </Link>
            <a
                href="https://github.com/devXprite/resumave"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-400 transition-all hover:border-gray-600 hover:bg-gray-700/50 hover:text-gray-200"
            >
                <FaGithub className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
            </a>
        </header>
    );
};

export default Header;
