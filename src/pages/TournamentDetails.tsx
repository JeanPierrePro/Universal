import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Tournament } from '../types/Tournament';
import { Calendar, Users, Trophy, Swords, ArrowLeft, MessageCircle, DollarSign, Share2, Shield, Check, X, Clock, Video, Mic2 } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

export function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useUserData();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDetails(); }, [id]);

  async function fetchDetails() {
    if (!id) return;
    try {
      const docRef = doc(db, "tournaments", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setTournament({ id: docSnap.id, ...docSnap.data() } as Tournament);
      else { alert("Não encontrado!"); navigate('/tournaments'); }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  async function handleApprove() {
    if (!tournament?.id || !confirm("Aprovar?")) return;
    await updateDoc(doc(db, "tournaments", tournament.id), { status: 'open' });
    fetchDetails();
  }

  async function handleReject() {
    if (!tournament?.id || !confirm("Excluir?")) return;
    await deleteDoc(doc(db, "tournaments", tournament.id));
    navigate('/admin');
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'A definir';
    return new Date(dateString).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="min-h-screen bg-[#0B0014] flex items-center justify-center text-white">Carregando...</div>;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-[#0B0014] text-white pb-12">
      <Navbar />
      
      <div className="pt-28 px-4 max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="w-full flex justify-start mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
            <ArrowLeft size={18} /> Voltar
          </button>
        </div>

        {/* CABEÇALHO */}
        <div className="text-center space-y-4 mb-8 w-full">
          <div className="flex justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Swords size={14} /> {tournament.gameMode}
            </span>
            {tournament.status === 'pending' && <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Clock size={14} /> Em Análise</span>}
            {tournament.status === 'open' && <span className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Check size={14} /> Inscrições Abertas</span>}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">{tournament.title}</h1>

          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Premiação Total</span>
            <span className="text-4xl font-bold text-green-400 flex items-center gap-2 drop-shadow-lg"><Trophy size={32} /> {tournament.prizePool}</span>
          </div>
        </div>

        {/* ÁREA ADMIN */}
        {isAdmin && (
          <div className="w-full bg-zinc-900 border border-yellow-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden text-center shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
            <h3 className="text-yellow-400 font-bold mb-4 flex items-center justify-center gap-2 text-lg"><Shield size={20} /> Área Restrita do Admin</h3>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/5 flex items-center gap-2 text-white font-mono">
                <MessageCircle size={16} className="text-purple-400" /> {tournament.contactInfo || "Sem contato"}
              </div>
              {tournament.wantsBroadcast && <div className="bg-purple-900/40 px-3 py-2 rounded-lg border border-purple-500/30 text-purple-200 text-sm font-bold flex items-center gap-2"><Video size={16} /> Quer Transmissão</div>}
              {tournament.wantsCaster && <div className="bg-pink-900/40 px-3 py-2 rounded-lg border border-pink-500/30 text-pink-200 text-sm font-bold flex items-center gap-2"><Mic2 size={16} /> Quer Narrador</div>}
            </div>

            <div className="flex justify-center gap-4">
              {tournament.status === 'pending' && <button onClick={handleApprove} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-transform hover:scale-105 flex items-center gap-2"><Check size={20} /> Aprovar</button>}
              <button onClick={handleReject} className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold transition-transform hover:scale-105 flex items-center gap-2"><X size={20} /> {tournament.status === 'pending' ? 'Rejeitar' : 'Excluir'}</button>
            </div>
          </div>
        )}

        {/* GRID INFORMAÇÕES */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center shadow-lg hover:border-purple-500/30 transition-colors">
            <Calendar className="text-purple-500 mb-3" size={24} />
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Data de Início</p>
            <p className="text-white font-semibold">{formatDate(tournament.startDate)}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center shadow-lg hover:border-blue-500/30 transition-colors">
            <Users className="text-blue-500 mb-3" size={24} />
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Vagas</p>
            <p className="text-white font-semibold">{tournament.maxTeams} Equipes</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center shadow-lg hover:border-emerald-500/30 transition-colors">
            <DollarSign className="text-emerald-500 mb-3" size={24} />
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Inscrição</p>
            <p className="text-white font-semibold">{tournament.entryFee === 0 ? "Gratuito" : `R$ ${tournament.entryFee}`}</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-3 mb-10">
          <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:-translate-y-1">Inscrever Minha Equipe</button>
          <button className="w-full py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition-colors flex justify-center items-center gap-2 border border-zinc-700"><Share2 size={18} /> Compartilhar</button>
        </div>

        <div className="w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800 flex items-center gap-2"><Swords className="text-purple-500" /> Regras e Detalhes</h2>
          <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed whitespace-pre-wrap text-left">{tournament.description}</div>
        </div>
      </div>
    </div>
  );
}