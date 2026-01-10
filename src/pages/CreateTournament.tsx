import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useUserData } from '../hooks/useUserData';
import { db, auth } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Trophy, Calendar, Users, DollarSign, Swords, MessageCircle } from 'lucide-react';

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
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSubmitting(true);

    try {
      const newTournament = {
        ...formData,
        createdBy: auth.currentUser.uid,
        status: isAdmin ? 'open' : 'pending', // Se não for admin, entra como pendente
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "tournaments"), newTournament);
      
      alert(isAdmin ? "Torneio oficial criado com sucesso!" : "Sugestão enviada! A administração entrará em contato.");
      navigate('/tournaments');
    } catch (error) {
      console.error("Erro ao criar:", error);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <Trophy className="text-violet-600" />
              {isAdmin ? "Criar Novo Torneio" : "Sugerir Torneio"}
            </h1>
            <p className="text-zinc-500 mt-2">
              {isAdmin 
                ? "Configure as regras e premiações do evento oficial." 
                : "Envie sua ideia. Se aprovada, entraremos em contato para organizar."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo de Contato OBRIGATÓRIO */}
            <div className="bg-violet-50 dark:bg-violet-900/10 p-4 rounded-lg border border-violet-100 dark:border-violet-900/30">
              <label className="block text-sm font-bold text-violet-700 dark:text-violet-400 mb-1 flex items-center gap-2">
                <MessageCircle size={16} /> Contato para Negociação (Obrigatório)
              </label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-950 border border-violet-200 dark:border-violet-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                placeholder="Ex: WhatsApp (11) 99999-9999 ou Discord User#1234"
                value={formData.contactInfo}
                onChange={e => setFormData({...formData, contactInfo: e.target.value})}
              />
              <p className="text-xs text-zinc-500 mt-1">Isso não será exibido publicamente, apenas para a administração.</p>
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome do Torneio</label>
              <input 
                required
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                placeholder="Ex: Copa Universal Season 1"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Grid de Configurações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
                  <Swords size={16} /> Modo de Jogo
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                  value={formData.gameMode}
                  onChange={e => setFormData({...formData, gameMode: e.target.value})}
                >
                  <option value="5v5">5v5 (Padrão)</option>
                  <option value="1v1">1v1 (X1)</option>
                  <option value="TFT">Magic Chess</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
                  <Users size={16} /> Máx. Times
                </label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                  value={formData.maxTeams}
                  onChange={e => setFormData({...formData, maxTeams: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} /> Data de Início
                </label>
                <input 
                  required
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-2">
                  <DollarSign size={16} /> Premiação
                </label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                  placeholder="Ex: 5000 Diamantes"
                  value={formData.prizePool}
                  onChange={e => setFormData({...formData, prizePool: e.target.value})}
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Regras e Descrição</label>
              <textarea 
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                placeholder="Descreva as regras do torneio..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-violet-600/20"
            >
              {isSubmitting ? "Enviando..." : (isAdmin ? "Publicar Torneio Oficial" : "Enviar Sugestão")}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}