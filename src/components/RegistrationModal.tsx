import { useState } from 'react';
import { X, Users, MessageCircle, Shield } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: RegistrationData) => Promise<void>;
}

export interface RegistrationData {
  teamName: string;
  contact: string;
  lineup: string;
}

export function RegistrationModal({ isOpen, onClose, onConfirm }: RegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    teamName: '',
    contact: '',
    lineup: ''
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await onConfirm(formData);
    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Fundo Escuro com Blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Card do Modal */}
      <div className="relative w-full max-w-md bg-[#0F0518] border border-purple-600 rounded-2xl p-6 shadow-[0_0_50px_rgba(126,34,206,0.5)] animate-fade-in-up">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Shield className="text-purple-500" /> Inscrição de Equipe
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          Preencha os dados para garantir sua vaga no torneio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-purple-300 mb-1">Nome da Equipe</label>
            <input 
              required
              type="text"
              placeholder="Ex: Kings of Mobile"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 outline-none text-white transition-all"
              value={formData.teamName}
              onChange={e => setFormData({...formData, teamName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-purple-300 mb-1 flex items-center gap-2">
              <MessageCircle size={14} /> Contato do Capitão
            </label>
            <input 
              required
              type="text"
              placeholder="WhatsApp ou Discord"
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 outline-none text-white transition-all"
              value={formData.contact}
              onChange={e => setFormData({...formData, contact: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-purple-300 mb-1 flex items-center gap-2">
              <Users size={14} /> Line-up (Jogadores)
            </label>
            <textarea 
              required
              rows={3}
              placeholder="Liste os nicks dos jogadores..."
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-purple-500/30 focus:border-purple-500 outline-none text-white transition-all resize-none"
              value={formData.lineup}
              onChange={e => setFormData({...formData, lineup: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all flex justify-center items-center"
          >
            {loading ? "Inscrevendo..." : "Confirmar Inscrição"}
          </button>

        </form>
      </div>
    </div>
  );
}