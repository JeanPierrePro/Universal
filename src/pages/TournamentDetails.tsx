import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc, increment, getDocs } from 'firebase/firestore';
import type { Tournament } from '../types/Tournament';
import { Calendar, Users, Trophy, Swords, ArrowLeft, MessageCircle, DollarSign, Share2, Shield, Check, X, Clock, Video, Mic2, User, Trash2 } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';
import { RegistrationModal, type RegistrationData } from '../components/RegistrationModal';
import { onAuthStateChanged } from 'firebase/auth';

interface Team {
  id: string;
  teamName: string;
  lineup: string;
  contact: string;
  captainId: string;
}

export function TournamentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useUserData();
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NOVO ESTADO: Guarda o ID do time se o usuário já estiver inscrito
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Monitora autenticação para atualizar o botão corretamente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && teams.length > 0) {
        checkIfUserIsRegistered(user.uid, teams);
      }
    });
    return () => unsubscribe();
  }, [teams]);

  useEffect(() => { 
    fetchDetails(); 
    fetchTeams(); 
  }, [id]);

  async function fetchDetails() {
    if (!id) return;
    try {
      const docRef = doc(db, "tournaments", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTournament({ id: docSnap.id, ...docSnap.data() } as Tournament);
      } else { 
        alert("Não encontrado!"); 
        navigate('/tournaments'); 
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  async function fetchTeams() {
    if (!id) return;
    try {
      const teamsRef = collection(db, "tournaments", id, "teams");
      const snapshot = await getDocs(teamsRef);
      const teamsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Team[];
      
      setTeams(teamsList);
      
      // Verifica se o usuário atual já tem um time nesta lista
      if (auth.currentUser) {
        checkIfUserIsRegistered(auth.currentUser.uid, teamsList);
      }
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    }
  }

  // Função auxiliar para verificar inscrição
  function checkIfUserIsRegistered(userId: string, currentTeams: Team[]) {
    const myTeam = currentTeams.find(t => t.captainId === userId);
    setMyTeamId(myTeam ? myTeam.id : null);
  }

  function handleOpenRegistration() {
    if (!currentUser) {
      alert("Você precisa estar logado para se inscrever!");
      navigate('/login');
      return;
    }
    if (tournament && (tournament.currentTeams || 0) >= tournament.maxTeams) {
      alert("Desculpe, este torneio já está lotado!");
      return;
    }
    setIsModalOpen(true);
  }

  // Lógica de Cancelar Inscrição
  async function handleCancelRegistration() {
    if (!tournament?.id || !myTeamId || !confirm("Tem certeza que deseja cancelar sua inscrição? Sua vaga será liberada.")) return;

    try {
      // 1. Remove o time da coleção
      await deleteDoc(doc(db, "tournaments", tournament.id, "teams", myTeamId));
      
      // 2. Diminui o contador (-1)
      const tournamentRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tournamentRef, { currentTeams: increment(-1) });

      alert("Inscrição cancelada com sucesso.");
      setMyTeamId(null); // Limpa o estado
      fetchDetails(); // Atualiza contador
      fetchTeams();   // Atualiza lista
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao cancelar inscrição.");
    }
  }

  async function handleConfirmRegistration(data: RegistrationData) {
    if (!tournament?.id || !currentUser) return;
    try {
      await addDoc(collection(db, "tournaments", tournament.id, "teams"), {
        ...data,
        captainId: currentUser.uid,
        registeredAt: new Date().toISOString(),
        status: 'approved'
      });
      const tournamentRef = doc(db, "tournaments", tournament.id);
      await updateDoc(tournamentRef, { currentTeams: increment(1) });
      
      alert("Inscrição confirmada! Vaga garantida.");
      setIsModalOpen(false);
      fetchDetails();
      fetchTeams();
    } catch (error) {
      console.error("Erro ao inscrever:", error);
      alert("Erro ao realizar inscrição.");
    }
  }

  // Admin Actions
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

  const current = tournament?.currentTeams || 0;
  const max = tournament?.maxTeams || 1;
  const percentage = Math.min((current / max) * 100, 100);

  if (loading) return <div className="min-h-screen bg-[#0B0014] flex items-center justify-center text-white">Carregando...</div>;
  if (!tournament) return null;

  return (
    <div className="min-h-screen bg-[#0B0014] text-white pb-12 relative">
      <Navbar />
      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmRegistration} />
      
      <div className="pt-28 px-4 max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-purple-400 transition-colors">
            <ArrowLeft size={18} /> Voltar
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4 mb-8 w-full">
          <div className="flex justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Swords size={14} /> {tournament.gameMode}</span>
            {tournament.status === 'pending' && <span className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Clock size={14} /> Em Análise</span>}
            {tournament.status === 'open' && <span className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2"><Check size={14} /> Inscrições Abertas</span>}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">{tournament.title}</h1>

          <div className="flex flex-col items-center gap-2">
            <span className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Premiação Total</span>
            <span className="text-4xl font-bold text-green-400 flex items-center gap-2 drop-shadow-lg"><Trophy size={32} /> {tournament.prizePool}</span>
          </div>
        </div>

        {/* ADMIN AREA */}
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
              {tournament.status === 'pending' && <button onClick={handleApprove} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center gap-2"><Check size={20} /> Aprovar</button>}
              <button onClick={handleReject} className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl font-bold flex items-center gap-2"><X size={20} /> Excluir</button>
            </div>
           </div>
        )}

        {/* STATS GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center shadow-lg hover:border-purple-500/30 transition-colors">
            <Calendar className="text-purple-500 mb-3" size={24} />
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Data de Início</p>
            <p className="text-white font-semibold">{formatDate(tournament.startDate)}</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center shadow-lg hover:border-blue-500/30 transition-colors relative overflow-hidden">
            <Users className="text-blue-500 mb-3" size={24} />
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Vagas Preenchidas</p>
            <p className="text-2xl font-bold text-white mb-2">{current} <span className="text-zinc-500 text-lg">/ {max}</span></p>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center shadow-lg hover:border-emerald-500/30 transition-colors">
            <DollarSign className="text-emerald-500 mb-3" size={24} />
            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Inscrição</p>
            <p className="text-white font-semibold">{tournament.entryFee === 0 ? "Gratuito" : `R$ ${tournament.entryFee}`}</p>
          </div>
        </div>

        {/* LISTA DE INSCRITOS */}
        <div className="w-full mb-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-purple-500 pl-4">
            <Users className="text-purple-500" /> 
            {tournament.gameMode === '1v1' ? 'Jogadores Inscritos' : 'Equipes Confirmadas'}
          </h2>
          
          {teams.length === 0 ? (
            <div className="w-full p-8 text-center bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
              <p className="text-zinc-500">Ninguém se inscreveu ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <div key={team.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all shadow-md group ${team.captainId === currentUser?.uid ? 'bg-purple-900/20 border-purple-500' : 'bg-zinc-900 border-zinc-800 hover:border-purple-500/50'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {tournament.gameMode === '1v1' ? <User size={18} className="text-blue-400" /> : <Shield size={18} className="text-purple-400" />}
                      <span className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                        {team.teamName} {team.captainId === currentUser?.uid && "(Você)"}
                      </span>
                    </div>
                    {tournament.gameMode !== '1v1' && (
                      <p className="text-xs text-zinc-500 line-clamp-1">Line: <span className="text-zinc-400">{team.lineup}</span></p>
                    )}
                    {isAdmin && (
                      <p className="text-xs text-yellow-500/80 mt-1 flex items-center gap-1 font-mono bg-yellow-900/10 w-fit px-1 rounded">
                        <MessageCircle size={10} /> {team.contact}
                      </p>
                    )}
                  </div>
                  <div className="px-3 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">Confirmado</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTÃO DE AÇÃO INTELIGENTE */}
        <div className="w-full max-w-md space-y-3 mb-10">
          
          {myTeamId ? (
            // OPÇÃO 1: JÁ INSCRITO -> MOSTRA BOTÃO DE CANCELAR
            <button 
              onClick={handleCancelRegistration}
              className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 font-bold rounded-xl text-lg transition-all flex justify-center items-center gap-2"
            >
              <Trash2 size={20} /> Cancelar Minha Inscrição
            </button>
          ) : (
            // OPÇÃO 2: NÃO INSCRITO -> MOSTRA BOTÃO DE INSCREVER (OU LOTADO)
            <button 
              onClick={handleOpenRegistration}
              disabled={(current >= max)}
              className={`w-full py-4 font-bold rounded-xl text-lg shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all transform hover:-translate-y-1
                ${(current >= max)
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
            >
              {(current >= max) ? "Inscrições Encerradas" : "Inscrever Minha Equipe"}
            </button>
          )}

          <button className="w-full py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition-colors flex justify-center items-center gap-2 border border-zinc-700">
            <Share2 size={18} /> Compartilhar
          </button>
        </div>

        <div className="w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-zinc-800 flex items-center gap-2"><Swords className="text-purple-500" /> Regras</h2>
          <div className="prose prose-invert max-w-none text-zinc-400">{tournament.description}</div>
        </div>
      </div>
    </div>
  );
}