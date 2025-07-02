import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import { HumorMap } from '../utils/enumMappings';

/* Fontes */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* Icones */
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

function DashboardPage() {
  const [userData, setUserData] = useState(null);
  const [afericoesCount, setAfericoesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [dashboardSummary, setDashboardSummary] = useState(null); 

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
            toast.alert('Sessão expirada ou não autorizada. Faça login novamente.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          const errorData = await userResponse.json();
          toast.error(errorData.message || `Erro ao carregar dados do usuário: ${userResponse.status}`);
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
            toast.alert('Sessão expirada ou não autorizada. Faça login novamente.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          const errorData = await afericoesResponse.json(); 
          toast.error(errorData.message || `Erro ao carregar aferições: ${afericoesResponse.status}`);
          console.error('Erro ao carregar aferições:', afericoesResponse.status, errorData);
          return;
        }
        const afericoesData = await afericoesResponse.json();
        setAfericoesCount(afericoesData.length || 0); 
        console.log('Dados de aferições:', afericoesData);


      } catch (err) {
        console.error('Erro geral ao buscar dados:', err);
        toast.error('Não foi possível conectar ao servidor. Verifique sua conexão ou o backend.');
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
      <div className="row" id='cardDashboard'>
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title"><strong>Bem-vindo(a), {userData ? userData.nomeCompleto : 'Usuário'}!</strong></h5>
              <p className="card-text">Este é o seu painel de controle pessoal.</p>
              <p className="card-text">Email: {userData ? userData.email : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title"><strong>Suas Aferições</strong></h5>
              <p className="card-text">Você registrou **{afericoesCount}** aferições até agora.</p>
              <Link to="/reports/daily-evolution" className="btn btn-outline-primary" id='btnEvolucaoDiaria'>Ver Evolução Diária</Link>
            </div>
          </div>
        </div>
      </div>

      <Row className="mb-5 mt-5 align-items-center"> 
        <Col md={6} id='imgDashboard'>
          <img 
            src="/src/img/img_bem_estar_2.jpeg" 
            alt="Conceito de Bem-Estar e Monitoramento" 
            className="img-fluid rounded shadow-sm" 
          />
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0" > 
            <Card.Body >
              <Card.Title className="text-primary">
                O Que é o Monitor de Bem-Estar?
              </Card.Title>
              <Card.Text>
                O Monitor de Bem-Estar é uma ferramenta dedicada a ajudá-lo a acompanhar e compreender melhor seus hábitos diários e seu estado emocional. Ao registrar informações sobre seu humor, tempo de tela, atividades físicas e muito mais, você pode identificar padrões, tomar decisões mais informadas e melhorar sua qualidade de vida.
              </Card.Text>
              <Card.Text>
                Comece a registrar seus dias e descubra como pequenos hábitos podem fazer uma grande diferença no seu bem-estar geral. Sua jornada para uma vida mais equilibrada começa aqui!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div>
  );
}

export default DashboardPage;