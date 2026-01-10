import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Tournament } from '../types/Tournament';
import { Check, X, MessageCircle, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    try {
      const q = query(collection(db, "tournaments"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tournament[];
      setSuggestions(data);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    if (!confirm("Aprovar este torneio?")) return;
    try {
      await updateDoc(doc(db, "tournaments", id), { status: 'open' });
      alert("Aprovado!");
      fetchSuggestions();
    } catch (error) { alert("Erro ao aprovar."); }
  }

  async function handleReject(id: string) {
    if (!confirm("Excluir esta sugestão?")) return;
    try {
      await deleteDoc(doc(db, "tournaments", id));
      alert("Removido.");
      fetchSuggestions();
    } catch (error) { alert("Erro ao remover."); }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 border-l-4 border-violet-600 pl-4">
          Painel Administrativo - Sugestões
        </h1>

        {loading ? <p className="text-zinc-500">Carregando...</p> : suggestions.length === 0 ? (
          <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
            <p className="text-zinc-500">Nenhuma sugestão pendente.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {suggestions.map((item) => (
              <div key={item.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                  <div className="flex items-center gap-2 text-violet-600 font-medium bg-violet-50 dark:bg-violet-900/20 p-2 rounded w-fit">
                    <MessageCircle size={16} /> Contato: {item.contactInfo || "N/A"}
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2">{item.description}</p>
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[160px]">
                  {/* Botão para VER DETALHES COMPLETOS */}
                  <button 
                    onClick={() => navigate(`/tournaments/${item.id}`)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg font-bold transition-colors"
                  >
                    <Eye size={18} /> Ver Detalhes
                  </button>

                  <button 
                    onClick={() => item.id && handleApprove(item.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                  >
                    <Check size={18} /> Aprovar
                  </button>
                  <button 
                    onClick={() => item.id && handleReject(item.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/50 rounded-lg font-bold transition-colors"
                  >
                    <X size={18} /> Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}