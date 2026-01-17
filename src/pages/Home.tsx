import { Navbar } from '../components/Navbar';
import { ArrowRight, Trophy, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#05000A] text-white selection:bg-purple-600 selection:text-white relative overflow-hidden">
      <Navbar />
      
      {/* Luz de Fundo */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-800/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-900/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-8 animate-fade-in-up">
          
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500 bg-purple-900/40 text-purple-200 text-sm font-bold mb-4 shadow-[0_0_15px_rgba(147,51,234,0.4)]">
            <Star size={14} className="mr-2 fill-purple-400 text-purple-400" />
            A Comunidade #1 de Mobile Legends
          </div>
          
          {/* Título */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl">
            Organize. Jogue. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
              Conquiste a Glória.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-400">
            A plataforma definitiva para gerenciar torneios profissionais e amadores. 
            Crie sua conta e comece sua jornada para o topo.
          </p>
          
          {/* Botões */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => navigate('/tournaments')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-purple-700 text-white font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(126,34,206,0.7)] border border-purple-500"
            >
              Ver Torneios <ArrowRight size={20} />
            </button>
            
            {/* BOTÃO DO WHATSAPP AQUI */}
            <button 
              onClick={() => window.open('https://chat.whatsapp.com/EAK7nLgfQBnHNSjKifMm4F', '_blank')}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-purple-600 text-purple-100 font-semibold bg-purple-900/10 hover:bg-purple-900/30 transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]"
            >
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
            <div key={i} className="p-8 rounded-2xl bg-[#0F0518]/90 backdrop-blur-sm border border-purple-600/60 shadow-[0_0_20px_rgba(126,34,206,0.2)] hover:shadow-[0_0_30px_rgba(126,34,206,0.4)] transition-all">
              <feature.icon className="w-12 h-12 text-purple-500 mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}