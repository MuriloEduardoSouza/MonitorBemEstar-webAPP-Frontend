import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Card } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2'; 
import {
  Chart as ChartJS,
  ArcElement, 
  Tooltip,
  Legend,
} from 'chart.js';
import { HumorMap } from '../utils/enumMappings'; 

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function HumorReportPage() {
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
        const response = await fetch('https://localhost:7071/api/registro-diarios/relatorio/humor', {
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
          setError(errorData.message || `Erro ao carregar relatório de humor: ${response.status}`);
          console.error('Erro ao carregar relatório de humor:', response.status, errorData);
          return;
        }

        const data = await response.json();
        setReportData(data);
        console.log('Dados do Relatório de Humor:', data);

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
        <p className="mt-2">Carregando Relatório de Humor...</p>
      </div>
    );
  }

  const labels = reportData ? reportData.map(item => HumorMap[item.humor] || `Humor ${item.humor}`) : [];
  const dataValues = reportData ? reportData.map(item => item.quantidade): [];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Número de Registros',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Vermelho
          'rgba(54, 162, 235, 0.6)', // Azul
          'rgba(255, 206, 86, 0.6)', // Amarelo
          'rgba(75, 192, 192, 0.6)', // Verde
          'rgba(153, 102, 255, 0.6)',// Roxo
          'rgba(255, 159, 64, 0.6)', // Laranja
          'rgba(199, 199, 199, 0.6)',// Cinza
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição de Humor',
      },
    },
  };

  return (
    <div className="container mt-5">
      <h2>Relatório de Humor</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {reportData && Object.keys(reportData).length > 0 ? (
        <Card className="p-3 shadow-sm">
          <div style={{ maxWidth: '500px', margin: 'auto' }}> 
            <Pie data={chartData} options={chartOptions} />
          </div>
        </Card>
      ) : (
        <Alert variant="info" className="text-center">
          Nenhum registro de humor encontrado para este relatório.
        </Alert>
      )}
    </div>
  );
}

export default HumorReportPage;