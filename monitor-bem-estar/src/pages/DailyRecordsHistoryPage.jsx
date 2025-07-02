// src/pages/DailyRecordsHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import { HumorMap, TipoAtividadeMap } from '../utils/enumMappings';
import { toast } from 'react-toastify';

/* Icones */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function DailyRecordsHistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchRecords = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Você não está autenticado. Por favor, faça login.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://localhost:7071/api/registro-diarios/meus-registros', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Sessão expirada ou não autorizada. Faça login novamente.');
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        toast.error(errorData.message || `Erro ao carregar registros: ${response.status}`);
        console.error('Erro ao carregar registros:', response.status, errorData);
        return;
      }

      const data = await response.json();
      setRecords(data);

    } catch (err) {
      console.error('Erro na requisição:', err);
      toast.error('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords(); 
  }, [navigate]);

  const handleDelete = async (id) => {
    debugger;
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) {
      return; 
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');

    if (!token) {
      toast.error('Você não está autenticado. Por favor, faça login.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const deleteUrl = `https://localhost:7071/api/registro-diarios/meu/${id}`;

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Sessão expirada ou não autorizada. Faça login novamente.');
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        const errorData = await response.json(); 
        toast.error(errorData.message || `Erro ao excluir registro: ${response.status}`);
        console.error('Erro ao excluir registro:', response.status, errorData);
        return;
      }

      toast.success('Registro excluído com sucesso!');
     
      setRecords(records.filter(record => record.id !== id));

    } catch (err) {
      console.error('Erro na requisição de exclusão:', err);
      toast.error('Não foi possível conectar ao servidor para excluir o registro.');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p className="mt-2">Carregando histórico de registros...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Meus Registros Diários</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {records.length === 0 ? (
        <Alert variant="info" className="text-center">
          Você ainda não possui nenhum registro diário. <Link to="/daily-record">Crie um agora!</Link>
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="mt-3 shadow-sm">
          <thead>
            <tr>
              <th>Data</th>
              <th>Humor</th>
              <th>Celular (h)</th>
              <th>Tipo Atividade</th>
              <th>Ações</th> 
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.dataRegistro).toLocaleDateString()}</td>
                <td>{HumorMap[record.humor] || record.humor}</td>
                <td>{record.horasCelular}</td>
                <td>{TipoAtividadeMap[record.tipoAtividade] || record.tipoAtividade}</td>
                <td>     
                  <Button variant="warning" size="sm" className="me-2" onClick={() => navigate(`/daily-record/edit/${record.id}`)}>
                    <FontAwesomeIcon icon={faEdit} className='me-1' />Editar
                  </Button>

                  <Button variant="danger" size="sm" onClick={() => handleDelete(record.id)}>
                   <FontAwesomeIcon icon={faTrashAlt} className='me-1' /> Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="mt-4 text-center">
        <Button variant="primary" onClick={() => navigate('/daily-record')}>
          Adicionar Novo Registro
        </Button>
      </div>
    </div>
  );
}

export default DailyRecordsHistoryPage;