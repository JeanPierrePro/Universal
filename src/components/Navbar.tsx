import { Link, useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { Trophy } from 'lucide-react'; // <--- AQUI: Removi LogOut e User que não estavam sendo usados
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const navigate = useNavigate();
  const { userData, isAdmin } = useUserData();

  async function handleLogout() {
    await signOut(auth);
    navigate('/');
  }

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-[#05000A]/90 backdrop-blur-md border-b border-purple-600 shadow-[0_4px_30px_rgba(126,34,206,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-violet-900 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              UNIVERSAL
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link to="/tournaments" className="text-gray-300 hover:text-purple-400 font-medium transition-colors flex items-center gap-2">
              <Trophy size={18} /> Torneios
            </Link>

            {userData ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-white">{userData.nickname}</span>
                  <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                    {isAdmin ? 'Admin' : 'Membro'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 rounded-lg bg-purple-700 text-white font-bold hover:bg-purple-600 transition-all shadow-[0_0_20px_rgba(126,34,206,0.5)] border border-purple-500/30"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}