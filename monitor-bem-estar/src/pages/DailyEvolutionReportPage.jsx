import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Card } from 'react-bootstrap'; 
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'; 


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DailyEvolutionReportPage() {
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
        const response = await fetch('https://localhost:7071/api/registro-diarios/relatorio/evolucao-diaria', {
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
          setError(errorData.message || `Erro ao carregar relatório: ${response.status}`);
          console.error('Erro ao carregar relatório:', response.status, errorData);
          return;
        }

        const data = await response.json();
        setReportData(data);
        console.log('Dados do Relatório de Evolução Diária:', data);

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
        <p className="mt-2">Carregando Relatório de Evolução Diária...</p>
      </div>
    );
  }

  
  const chartData = {
    labels: reportData ? reportData.map(item => item.data) : [], 
    datasets: [
      {
        label: 'Horas de Celular por Dia',
        data: reportData ? reportData.map(item => item.horas) : [], 
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1, 
      },
    ],
  };

  // Opções do gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução Diária de Horas de Celular',
      },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Data',
            }
        },
        y: {
            title: {
                display: true,
                text: 'Horas',
            },
            beginAtZero: true, 
            ticks: {
               
                callback: function(value) {
                    if (Number.isInteger(value)) {
                        return value;
                    }
                    return value.toFixed(1); 
                }
            }
        }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Relatório de Evolução Diária</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {reportData && reportData.length > 0 ? (
        <Card className="p-3 shadow-sm">
          <Line data={chartData} options={chartOptions} />
        </Card>
      ) : (
        <Alert variant="info" className="text-center">
          Nenhum registro encontrado para este relatório no período.
        </Alert>
      )}
    </div>
  );
}

export default DailyEvolutionReportPage;