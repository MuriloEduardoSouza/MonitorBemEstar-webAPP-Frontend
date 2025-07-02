// src/pages/AtividadesReportPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Card, Form, Row, Col, Button as BootstrapButton } from 'react-bootstrap'; 
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TipoAtividadeMap } from '../utils/enumMappings'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function AtividadesReportPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const fetchReport = async () => { 
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Você não está autenticado. Por favor, faça login.');
      setLoading(false);
      navigate('/login');
      return;
    }

    let url = 'https://localhost:7071/api/registro-diarios/relatorio/atividades';
    const params = new URLSearchParams();
    if (dataInicio) {
      params.append('dataInicioStr', dataInicio);
    }
    if (dataFim) {
      params.append('dataFimStr', dataFim);
    }
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert('Sessão expirada ou não autorizada. Faça login novamente.');
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        setError(errorData.message || `Erro ao carregar relatório de atividades: ${response.status}`);
        console.error('Erro ao carregar relatório de atividades:', response.status, errorData);
        return;
      }

      const data = await response.json();
      setReportData(data);
      console.log('Dados do Relatório de Atividades:', data);

    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Não foi possível conectar ao servidor. Verifique sua conexão ou o backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(); 
  }, [navigate, dataInicio, dataFim]); 

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchReport(); // Re-fetch com os novos filtros
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando Relatório de Atividades...</p>
      </div>
    );
  }

  const labels = reportData ? reportData.map(item => TipoAtividadeMap[item.atividade] || `Atividade ${item.atividade}`) : [];
  const dataValues = reportData ? reportData.map(item => item.quantidade) : [];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Número de Registros',
        data: dataValues,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Distribuição de Atividades',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade',
        },
        ticks: {
            stepSize: 1, 
        }
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2>Relatório de Atividades</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Seção de Filtro de Data */}
      <Card className="p-3 shadow-sm mb-4">
        <Card.Body>
          <Card.Title>Filtrar por Período</Card.Title>
          <Form onSubmit={handleFilterSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label htmlFor="dataInicioInput">Data Início</Form.Label>
                  <Form.Control
                    type="date"
                    id="dataInicioInput"
                    name="dataInicio"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label htmlFor="dataFimInput">Data Fim</Form.Label>
                  <Form.Control
                    type="date"
                    id="dataFimInput"
                    name="dataFim"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <BootstrapButton variant="primary" type="submit">
              Aplicar Filtro
            </BootstrapButton>
             <BootstrapButton variant="secondary" className="ms-2" onClick={() => { setDataInicio(''); setDataFim(''); }}>
              Limpar Filtro
            </BootstrapButton>
          </Form>
        </Card.Body>
      </Card>


      {reportData && reportData.length > 0 ? (
        <Card className="p-3 shadow-sm">
          <div style={{ maxWidth: '700px', margin: 'auto' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card>
      ) : (
        <Alert variant="info" className="text-center">
          Nenhum registro de atividade encontrado para o período selecionado.
          
        </Alert>
      )}
    </div>
  );
}

export default AtividadesReportPage;