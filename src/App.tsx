import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreateTournament } from './pages/CreateTournament';
import { Tournaments } from './pages/Tournaments';
import { AdminDashboard } from './pages/AdminDashboard';
import { TournamentDetails } from './pages/TournamentDetails'; // Nova Importação

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/tournaments/new" element={<CreateTournament />} />
          
          {/* Nova Rota Dinâmica (Aceita qualquer ID) */}
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App