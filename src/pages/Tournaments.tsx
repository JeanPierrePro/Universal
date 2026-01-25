import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { db, auth } from '../lib/firebase';
// AQUI: Removi 'getDocs' que estava sobrando
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import type { Tournament } from '../types/Tournament';
import { Calendar, Users, Trophy, Plus, Swords, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';
import { onAuthStateChanged } from 'firebase/auth';

export function Tournaments() {
  const navigate = useNavigate();
  const { isAdmin } = useUserData();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "tournaments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tournament[];
      setTournaments(data.filter(t => t.status === 'open'));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#05000A] text-white">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Trophy className="text-purple-500" /> Torneios Ativos
            </h1>
            <p className="text-zinc-400 mt-1">Inscreva sua equipe e mostre quem manda.</p>
          </div>
          
          <div className="flex gap-3">
            {isAdmin && (
              <button onClick={() => navigate('/admin')} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-zinc-700 transition-all">
                Ver Sugestões
              </button>
            )}
            {user ? (
              <button onClick={() => navigate('/tournaments/new')} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                <Plus size={20} /> {isAdmin ? "Criar Oficial" : "Sugerir Torneio"}
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-bold rounded-lg border border-zinc-700 transition-all">
                <LogIn size={20} /> Entrar para Sugerir
              </button>
            )}
          </div>
        </div>

        {loading && <div className="text-center py-20 text-zinc-500">Carregando torneios...</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-purple-500/50 transition-all group shadow-lg flex flex-col">
              
              <div className="p-6 pb-4 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">Inscrições Abertas</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-purple-400"><Swords size={16} /> {tournament.gameMode}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{tournament.title}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{tournament.description}</p>

                <div className="space-y-3 text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-purple-500" />
                    {formatDate(tournament.startDate)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-blue-500" />
                    <span className="font-bold text-white">
                      {tournament.currentTeams || 0}
                      <span className="text-zinc-500 font-normal"> / {tournament.maxTeams} Inscritos</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-semibold text-emerald-400">
                    <Trophy size={16} /> Prêmio: {tournament.prizePool}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-800 bg-black/20">
                <button onClick={() => navigate(`/tournaments/${tournament.id}`)} className="w-full py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-medium hover:bg-purple-600 hover:border-purple-500 transition-all">
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}