import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { Tournament } from '../types/Tournament';
import { Calendar, Users, Trophy, Plus, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/useUserData';

export function Tournaments() {
  const navigate = useNavigate();
  const { isAdmin } = useUserData();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        // Busca tudo ordenado por data
        const q = query(collection(db, "tournaments"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tournament[];

        // O PULO DO GATO: Filtra para mostrar APENAS os abertos (aprovados)
        // Sugestões (pending) ficam escondidas aqui
        setTournaments(data.filter(t => t.status === 'open'));
        
      } catch (error) {
        console.error("Erro ao buscar torneios:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTournaments();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Trophy className="text-violet-600" /> Torneios Ativos
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Inscreva sua equipe e mostre quem manda.
            </p>
          </div>
          
          <div className="flex gap-3">
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg border border-zinc-700 transition-all"
              >
                Ver Sugestões
              </button>
            )}
            
            <button 
              onClick={() => navigate('/tournaments/new')}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-violet-600/20"
            >
              <Plus size={20} /> {isAdmin ? "Criar Oficial" : "Sugerir Torneio"}
            </button>
          </div>
        </div>

        {loading && <div className="text-center py-20 text-zinc-500">Carregando torneios...</div>}

        {!loading && tournaments.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <Trophy size={48} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-lg text-zinc-500">Nenhum torneio oficial ativo no momento.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-violet-500/50 transition-all group shadow-sm hover:shadow-md flex flex-col">
              
              <div className="p-6 pb-4 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Inscrições Abertas
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-violet-600 dark:text-violet-400">
                    <Swords size={16} /> {tournament.gameMode}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-violet-600 transition-colors">
                  {tournament.title}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 mb-4">
                  {tournament.description}
                </p>

                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-zinc-400" />
                    {formatDate(tournament.startDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-zinc-400" />
                    Max {tournament.maxTeams} Times
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-green-600 dark:text-green-400">
                    <Trophy size={16} />
                    Prêmio: {tournament.prizePool}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <button 
                  onClick={() => navigate(`/tournaments/${tournament.id}`)}
                  className="w-full py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-medium hover:bg-violet-600 hover:text-white hover:border-violet-600 dark:hover:bg-violet-600 transition-all"
                >
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