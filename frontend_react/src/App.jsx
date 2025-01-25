import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import AuthenticatedRoute from './utils/AuthenticatedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AuthenticatedRoute element={<HomePage />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
