import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';
import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../src/pages/DashboardPage';
import LayoutComponent from '../src/components/common/LayoutComponent';
import LoginPage  from '../src/pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DailyEvolutionReportPage from './pages/DailyEvolutionReportPage';
import DailyRecordPage from './pages/DailyRecordPage';
import DailyRecordsHistoryPage from './pages/DailyRecordsHistoryPage';
import HumorReportPage from './pages/HumorReportPage';
import HorasCelularReportPage from './pages/HorasCelularReportPage';
import AtividadesReportPage from './pages/AtividadesReportPage';
import UserProfilePage from './pages/UserProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); 

  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); 
  };

  
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    setIsLoggedIn(false); 
    
  };

   return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

           <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage />}
        />

        <Route
          path="/dashboard"
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><DashboardPage /></LayoutComponent> : <Navigate to="/login" />}
        />

         <Route
          path="/reports/daily-evolution" 
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><DailyEvolutionReportPage /></LayoutComponent> : <Navigate to="/login" />}
        />

         <Route
          path="/daily-record" 
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><DailyRecordPage /></LayoutComponent> : <Navigate to="/login" />}
        />

           <Route
          path="/historico"
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><DailyRecordsHistoryPage /></LayoutComponent> : <Navigate to="/login" />}
        />

          <Route
          path="/daily-record/edit/:id" 
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><DailyRecordPage /></LayoutComponent> : <Navigate to="/login" />}
        />

          <Route
          path="/reports/humor" 
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><HumorReportPage /></LayoutComponent> : <Navigate to="/login" />}
        />

         <Route
          path="/reports/phone-usage"
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><HorasCelularReportPage /></LayoutComponent> : <Navigate to="/login" />}
        />

          <Route
          path="/reports/activities" 
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><AtividadesReportPage /></LayoutComponent> : <Navigate to="/login" />}
        />

          <Route
          path="/profile" 
          element={isLoggedIn ? <LayoutComponent onLogout={handleLogout}><UserProfilePage /></LayoutComponent> : <Navigate to="/login" />}
        />

        <Route
          path="*" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;