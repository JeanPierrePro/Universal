import { Navbar } from '../components/Navbar';
import { ArrowRight, Trophy, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
            <Star size={14} className="mr-2 fill-current" />
            A Comunidade #1 de Mobile Legends
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Organize. Jogue. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Conquiste a Glória.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-zinc-500 dark:text-zinc-400">
            A plataforma definitiva para gerenciar torneios profissionais e amadores. 
            Crie sua conta e comece sua jornada para o topo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/tournaments')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
            >
              Ver Torneios <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            { icon: Trophy, title: "Torneios Oficiais", desc: "Participe de competições verificadas com premiações reais." },
            { icon: Users, title: "Comunidade Ativa", desc: "Encontre times, complete sua squad e faça networking." },
            { icon: Star, title: "Rankings", desc: "Suba na tabela de classificação e mostre seu valor." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-violet-500/50 transition-colors">
              <feature.icon className="w-10 h-10 text-violet-600 mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}