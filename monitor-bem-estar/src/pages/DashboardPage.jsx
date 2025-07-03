import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap';
import { HumorMap } from '../utils/enumMappings';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import ImageCarousel from '../components/common/ImageCarousel';


 function ContadorAnimado({ titulo, valorFinal}){
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.5,
      });

    return(
      <div ref={ref} className="text-center my-4">
        <h5 className="text-primary">{titulo}</h5>
        <h2 style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
          {inView && <CountUp end={valorFinal} duration={2} />}
        </h2>
      </div>
    );
        
      
  }

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
    <>
    
      <div className="dashboard-dark-section">
        <div className="container py-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <h2 className="mb-4"><strong>Dashboard do Usuário</strong></h2>
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
  
      <Row className="mb-5 mt-5 align-items-center" id='testando'> 
        <Col md={6}>
          <img 
            src="/public/img/img_bem_estar_2.jpeg" 
            alt="Conceito de Bem-Estar e Monitoramento" 
            className="img-fluid rounded shadow-sm"
            id='imgDashboard'
          />
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm border-0" id="cardDescricao"> 
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
      </div>

       <div className="dashboard-light-section">
        <div className="container py-5">
        <Row className="align-items-center my-5">
          <Col md={6}>
            <Card className="h-100 shadow-sm border-0" id='cardDescricao'>
              <Card.Body>
              <Card.Title className="text-primary">Outro Título</Card.Title>
              <Card.Text>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis ducimus sint voluptates tempore alias aut in beatae labore. Soluta voluptas dignissimos quam animi non voluptatibus, et numquam quisquam magni laborum.
                  <br /> <br />
                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit illum suscipit aspernatur neque in libero veritatis placeat optio vitae molestias quia ad corrupti omnis asperiores laboriosam eum, qui voluptatibus ipsa!
                  <br /> <br />
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis in architecto impedit ea, esse sit eius aut optio dignissimos, dolorum sint omnis fugiat nesciunt cumque. Harum porro unde sit natus.
              </Card.Text>
              </Card.Body>
            </Card>
            </Col>

        <Col md={6} className="order-md-last">
          <img
            src="/public/img/corrida_bem_estar.jpeg"
            alt="Imagem lado direito"
            className="img-fluid rounded shadow-sm"
            id='imgDashboard'
          />
        </Col>
      </Row>
      </div>
      </div>  


      <div className="py-5 bg-light">
  <div className="container">
    <Row>
      <Col md={4}>
        <ContadorAnimado titulo="Usuários Cadastrados" valorFinal={2548} />
      </Col>
      <Col md={4}>
        <ContadorAnimado titulo="Pessoas satisfeitas" valorFinal={2032} />
      </Col>
      <Col md={4}>
        <ContadorAnimado titulo="Faixa de registros diários" valorFinal={548} />
      </Col>
    </Row>
  </div>
</div>

<div className="text-center mt-4">
  <Button 
    variant="primary" 
    size="lg" 
    style={{ width: '60%' }}
    onClick={() => navigate('/daily-record')}
    id='btnRegistro'
  >
    Quero realizar um novo registro
  </Button>
</div>

    <ImageCarousel />

    </>
  );
}

export default DashboardPage;

