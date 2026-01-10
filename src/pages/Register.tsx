import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Eye, EyeOff, CheckCircle2, ArrowLeft, UserPlus } from 'lucide-react';

export function Register() {
  const navigate = useNavigate();
  
  // Estados do formulário
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de controle visual
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Cria a conta na Autenticação
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva os dados no Firestore (Banco de Dados)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nickname: nickname,
        email: email,
        role: 'user', // Padrão
        createdAt: new Date().toISOString()
      });
      
      // 3. Desloga o usuário imediatamente (para forçar login depois)
      await signOut(auth);

      // 4. Mostra tela de sucesso e redireciona
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000); // Espera 2 segundos e vai para o Login

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso por outro guerreiro.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      setLoading(false);
    }
  }

  // Tela de Sucesso (Animada)
  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors px-4">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center max-w-md w-full animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 animate-bounce">
              <CheckCircle2 size={48} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Conta Criada!</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Sua jornada começa agora, <strong>{nickname}</strong>.
            <br/>Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
        
        {/* Botão Voltar */}
        <Link to="/login" className="inline-flex items-center text-sm text-zinc-500 hover:text-violet-600 mb-6 transition-colors group">
          <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> 
          Voltar para Login
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4">
            <UserPlus className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Crie sua conta</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Junte-se à maior comunidade de MLBB</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
             <span className="font-bold">Erro:</span> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Campo Nickname */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nick no Jogo
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white placeholder-zinc-400"
              placeholder="Ex: ProPlayerMLBB"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              required
            />
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              E-mail
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white placeholder-zinc-400"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo Senha com Olhinho */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white placeholder-zinc-400 pr-10"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-violet-600/20 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? 'Criando conta...' : 'Registrar-se'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Ao se registrar, você concorda com nossos <a href="#" className="text-zinc-400 hover:text-white underline">Termos</a>.
        </p>
      </div>
    </div>
  );
}