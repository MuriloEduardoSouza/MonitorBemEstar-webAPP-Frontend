import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [afericoesCount, setAfericoesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
       
        const userResponse = await fetch('https://localhost:7071/api/usuarios/me', { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401 || userResponse.status === 403) {
            alert('Sessão expirada ou não autorizada. Faça login novamente.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          const errorData = await userResponse.json();
          setError(errorData.message || `Erro ao carregar dados do usuário: ${userResponse.status}`);
          console.error('Erro ao carregar dados do usuário:', userResponse.status, errorData);
          return;
        }
        const userDataFetched = await userResponse.json();
        setUserData(userDataFetched);
        console.log('Dados do usuário:', userDataFetched);

       
        const afericoesResponse = await fetch('https://localhost:7071/api/registro-diarios/meus-registros', { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!afericoesResponse.ok) {
          if (afericoesResponse.status === 401 || afericoesResponse.status === 403) {
            alert('Sessão expirada ou não autorizada. Faça login novamente.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          const errorData = await afericoesResponse.json(); 
          setError(errorData.message || `Erro ao carregar aferições: ${afericoesResponse.status}`);
          console.error('Erro ao carregar aferições:', afericoesResponse.status, errorData);
          return;
        }
        const afericoesData = await afericoesResponse.json();
        setAfericoesCount(afericoesData.length || 0); 
        console.log('Dados de aferições:', afericoesData);


      } catch (err) {
        console.error('Erro geral ao buscar dados:', err);
        setError('Não foi possível conectar ao servidor. Verifique sua conexão ou o backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-2">Carregando dados da Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <h2 className="mb-4">Dashboard do Usuário</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Bem-vindo(a), {userData ? userData.nomeCompleto : 'Usuário'}!</h5>
              <p className="card-text">Este é o seu painel de controle pessoal.</p>
              <p className="card-text">Email: {userData ? userData.email : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Suas Aferições</h5>
              <p className="card-text">Você registrou **{afericoesCount}** aferições até agora.</p>
              <Link to="/reports/daily-evolution" className="btn btn-outline-primary">Ver Evolução Diária</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;