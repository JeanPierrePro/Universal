import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Trophy, User } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = auth.currentUser;

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
  }

  return (
    <nav className="fixed top-0 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            UNIVERSAL
          </Link>

          {/* Links e Ações */}
          <div className="flex items-center gap-6">
            <Link to="/tournaments" className="hidden md:flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
              <Trophy size={18} />
              <span>Torneios</span>
            </Link>

            {/* Botão Tema */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Login/Logout */}
            {user ? (
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-600"
              >
                Sair
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:opacity-90 transition-opacity"
              >
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}