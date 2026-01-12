import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Tournament } from '../types/Tournament';
import { Check, X, MessageCircle, AlertCircle, Eye, Video, Mic2 } from 'lucide-react';
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
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  async function handleApprove(id: string) {
    if (!confirm("Aprovar?")) return;
    await updateDoc(doc(db, "tournaments", id), { status: 'open' });
    fetchSuggestions();
  }

  async function handleReject(id: string) {
    if (!confirm("Excluir?")) return;
    await deleteDoc(doc(db, "tournaments", id));
    fetchSuggestions();
  }

  return (
    <div className="min-h-screen bg-[#0B0014] text-white">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 border-l-4 border-purple-600 pl-4 text-white">
          Painel Administrativo - Sugestões
        </h1>

        {loading ? <p className="text-zinc-500">Carregando...</p> : suggestions.length === 0 ? (
          <div className="p-8 bg-zinc-900 rounded-xl border border-zinc-800 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
            <p className="text-zinc-500">Nenhuma sugestão pendente.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {suggestions.map((item) => (
              <div key={item.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <div className="flex gap-2">
                      {item.wantsBroadcast && <span title="Quer Transmissão" className="p-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg"><Video size={18} /></span>}
                      {item.wantsCaster && <span title="Quer Narrador" className="p-1.5 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg"><Mic2 size={18} /></span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400 font-medium bg-purple-900/20 p-2 rounded w-fit border border-purple-500/20">
                    <MessageCircle size={16} /> Contato: {item.contactInfo || "N/A"}
                  </div>
                  <p className="text-zinc-400 text-sm line-clamp-2">{item.description}</p>
                </div>

                <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[160px]">
                  <button onClick={() => navigate(`/tournaments/${item.id}`)} className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 rounded-lg font-bold border border-zinc-700">
                    <Eye size={18} /> Ver
                  </button>
                  <button onClick={() => item.id && handleApprove(item.id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold">
                    <Check size={18} /> Aprovar
                  </button>
                  <button onClick={() => item.id && handleReject(item.id)} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg font-bold">
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