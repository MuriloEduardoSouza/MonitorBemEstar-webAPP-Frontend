// src/pages/HorasCelularReportPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Card, Row, Col } from 'react-bootstrap'; 
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


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function HorasCelularReportPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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

      try {
        const response = await fetch('https://localhost:7071/api/registro-diarios/relatorio/horas-celular', {
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
          setError(errorData.message || `Erro ao carregar relatório de horas de celular: ${response.status}`);
          console.error('Erro ao carregar relatório de horas de celular:', response.status, errorData);
          return;
        }

        const data = await response.json();
        setReportData(data);
        console.log('Dados do Relatório de Horas de Celular:', data);

      } catch (err) {
        console.error('Erro na requisição:', err);
        setError('Não foi possível conectar ao servidor. Verifique sua conexão ou o backend.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando Relatório de Horas de Celular...</p>
      </div>
    );
  }

  const chartData = {
    labels: ['Última Semana', 'Mês Atual'],
    datasets: [
      {
        label: 'Horas de Celular',
        data: reportData ? [reportData.horasUltimaSemana, reportData.horasMesAtual] : [0, 0],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
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
        text: 'Comparativo de Horas de Celular',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Horas',
        },
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2>Relatório de Horas de Celular</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {reportData ? (
        <Row className="justify-content-center mt-4">
          <Col md={5} className="mb-4">
            <Card className="text-center shadow-sm">
              <Card.Header className="bg-info text-white">Última Semana</Card.Header>
              <Card.Body>
                <Card.Title as="h1">{reportData.horasUltimaSemana} h</Card.Title>
                <Card.Text>Total de horas de celular nos últimos 7 dias.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={5} className="mb-4">
            <Card className="text-center shadow-sm">
              <Card.Header className="bg-success text-white">Mês Atual</Card.Header>
              <Card.Body>
                <Card.Title as="h1">{reportData.horasMesAtual} h</Card.Title>
                <Card.Text>Total de horas de celular no mês corrente.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          Nenhum dado de horas de celular disponível. Registre mais dados diários!
        </Alert>
      )}
    </div>
  );
}

export default HorasCelularReportPage;