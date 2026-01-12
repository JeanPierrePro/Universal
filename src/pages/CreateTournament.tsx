import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useUserData } from '../hooks/useUserData';
import { db, auth } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Trophy, Calendar, Users, DollarSign, Swords, MessageCircle, Video, Mic2 } from 'lucide-react';

export function CreateTournament() {
  const navigate = useNavigate();
  const { isAdmin, loading } = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gameMode: '5v5',
    maxTeams: 16,
    startDate: '',
    entryFee: 0,
    prizePool: '',
    contactInfo: '',
    wantsBroadcast: false,
    wantsCaster: false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSubmitting(true);

    try {
      const newTournament = {
        ...formData,
        createdBy: auth.currentUser.uid,
        status: isAdmin ? 'open' : 'pending', 
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "tournaments"), newTournament);
      alert(isAdmin ? "Torneio criado!" : "Sugestão enviada com sucesso!");
      navigate('/tournaments');
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-[#0B0014] flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0B0014] text-white transition-colors relative overflow-hidden">
      {/* Fundo Universo sutil para manter consistência */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-purple-900/20 blur-[120px] pointer-events-none" />
      
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto relative z-10">
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Trophy className="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              {isAdmin ? "Criar Novo Torneio" : "Sugerir Torneio"}
            </h1>
            <p className="text-zinc-400 mt-2">
              Preencha os dados abaixo para organizarmos seu campeonato.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Contato */}
            <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/30">
              <label className="block text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
                <MessageCircle size={16} /> Contato (WhatsApp/Discord)
              </label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white placeholder-zinc-600 transition-all"
                placeholder="Ex: Discord User#1234"
                value={formData.contactInfo}
                onChange={e => setFormData({...formData, contactInfo: e.target.value})}
              />
            </div>

            {/* Serviços Extras (Brilhantes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, wantsBroadcast: !formData.wantsBroadcast})}
                className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-3 group
                  ${formData.wantsBroadcast 
                    ? 'border-purple-500 bg-purple-600/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                    : 'border-zinc-800 bg-black/30 hover:border-purple-500/50 hover:bg-purple-900/10'}`}
              >
                <div className={`p-2 rounded-full transition-colors ${formData.wantsBroadcast ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-purple-400'}`}>
                  <Video size={20} />
                </div>
                <div>
                  <p className={`font-bold transition-colors ${formData.wantsBroadcast ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Transmissão Ao Vivo</p>
                  <p className="text-xs text-zinc-500">Live no canal da Universal</p>
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, wantsCaster: !formData.wantsCaster})}
                className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-3 group
                  ${formData.wantsCaster 
                    ? 'border-pink-500 bg-pink-600/20 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                    : 'border-zinc-800 bg-black/30 hover:border-pink-500/50 hover:bg-pink-900/10'}`}
              >
                <div className={`p-2 rounded-full transition-colors ${formData.wantsCaster ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-500 group-hover:text-pink-400'}`}>
                  <Mic2 size={20} />
                </div>
                <div>
                  <p className={`font-bold transition-colors ${formData.wantsCaster ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Narrador / Caster</p>
                  <p className="text-xs text-zinc-500">Narração profissional</p>
                </div>
              </div>
            </div>

            {/* Campos Padrão com estilo Dark */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nome do Torneio</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-white transition-all"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2"><Swords size={16} /> Modo</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-white transition-all"
                  value={formData.gameMode}
                  onChange={e => setFormData({...formData, gameMode: e.target.value})}
                >
                  <option value="5v5">5v5 (Padrão)</option>
                  <option value="1v1">1v1 (X1)</option>
                  <option value="TFT">Magic Chess</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2"><Users size={16} /> Vagas</label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-white transition-all"
                  value={formData.maxTeams}
                  onChange={e => setFormData({...formData, maxTeams: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2"><Calendar size={16} /> Data</label>
                <input 
                  required
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-white transition-all"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2"><DollarSign size={16} /> Premiação</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-white transition-all"
                  value={formData.prizePool}
                  onChange={e => setFormData({...formData, prizePool: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Descrição</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-purple-500 outline-none text-white transition-all"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
            >
              {isSubmitting ? "Enviando..." : (isAdmin ? "Publicar Oficial" : "Enviar Sugestão")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}