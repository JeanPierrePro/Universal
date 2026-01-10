import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Animação de sucesso
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500); 
    } catch (err) {
      setError('Credenciais inválidas. Verifique e-mail e senha.');
    }
  }

  async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Erro ao conectar com Google.');
    }
  }

  // Tela de Sucesso
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors">
        <div className="animate-bounce mb-4">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white animate-pulse">Login realizado com sucesso!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
        
        <Link to="/" className="inline-flex items-center text-sm text-zinc-500 hover:text-violet-600 mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Voltar para Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Entre na sua conta para gerenciar torneios</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-mail</label>
            <input 
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white pr-10"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02]">
            Entrar
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-zinc-900 text-zinc-500">Ou continue com</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Google
        </button>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Não tem uma conta? <Link to="/register" className="font-semibold text-violet-600 hover:underline">Crie agora</Link>
        </p>
      </div>
    </div>
  );
}