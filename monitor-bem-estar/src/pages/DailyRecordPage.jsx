import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap'; 
import { HumorMap, TipoAtividadeMap } from '../utils/enumMappings';

function DailyRecordPage() {
  const { id } = useParams(); 
  const isEditMode = id !== undefined; 

  const recordId = isEditMode ? String(id).split(':') [0] : null;
  console.log("ID Sanitizado (recordId):", recordId);

  const [dataRegistro, setDataRegistro] = useState('');
  const [humor, setHumor] = useState('');
  const [horasCelular, setHorasCelular] = useState('');
  const [tipoAtividade, setTipoAtividade] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(isEditMode); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isEditMode) {
      const fetchRecordToEdit = async () => {
        setInitialDataLoading(true);
        setError('');
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError('Você não está autenticado. Por favor, faça login.');
          setInitialDataLoading(false);
          navigate('/login');
          return;
        }

          try {
          
          const fetchUrl = `https://localhost:7071/api/registro-diarios/meu/${recordId}`;
          console.log("URL de GET para edição (FINALMENTE):", fetchUrl);

          const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
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
            setError(errorData.message || `Erro ao carregar registro para edição: ${response.status}`);
            console.error('Erro ao carregar registro:', response.status, errorData);
            return;
          }

          const data = await response.json();
          
          setDataRegistro(data.dataRegistro.split('T')[0]); 
          setHumor(data.humor.toString()); 
          setHorasCelular(data.horasCelular.toString()); 
          setTipoAtividade(data.tipoAtividade.toString()); 
          
        } catch (err) {
          console.error('Erro na requisição de carregamento:', err);
          setError('Não foi possível carregar o registro para edição. Tente novamente mais tarde.');
        } finally {
          setInitialDataLoading(false);
        }
      };

      fetchRecordToEdit();
    }
  }, [id, isEditMode, navigate]); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Você não está autenticado. Por favor, faça login.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const recordData = {
      dataRegistro: dataRegistro,
      humor: parseInt(humor, 10),
      horasCelular: parseFloat(horasCelular),
      tipoAtividade: parseInt(tipoAtividade, 10),
    };

    
    if (!recordData.dataRegistro || isNaN(recordData.humor) || isNaN(recordData.horasCelular) || isNaN(recordData.tipoAtividade)) {
        setError("Por favor, preencha todos os campos obrigatórios com valores válidos.");
        setLoading(false);
        return;
    }

    try {
      
      const url = isEditMode ? `https://localhost:7071/api/registro-diarios/meu/${id}` : 'https://localhost:7071/api/registro-diarios';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError('Sessão expirada ou não autorizada. Faça login novamente.');
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        let errorMessage = `Erro ao ${isEditMode ? 'atualizar' : 'registrar'} dados diários.`;
        if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(' ');
        } else if (errorData.message) {
            errorMessage = errorData.message;
        }
        setError(errorMessage);
        console.error(`Erro de ${isEditMode ? 'edição' : 'registro'} diário:`, response.status, errorData);
        return;
      }

      setSuccessMessage(`Registro diário ${isEditMode ? 'atualizado' : 'salvo'} com sucesso!`);
      if (!isEditMode) {
        setDataRegistro('');
        setHumor('');
        setHorasCelular('');
        setTipoAtividade('');
      }
    
      if (isEditMode) {
        setTimeout(() => navigate('/historico'), 1500); 
      }

    } catch (err) {
      console.error('Erro na requisição:', err);
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (initialDataLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Carregando registro...</span>
        </Spinner>
        <p className="mt-2">Carregando dados para edição...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <Card className="shadow-lg">
        <Card.Header className={`text-center ${isEditMode ? 'bg-warning' : 'bg-info'} text-white`}>
          <h3>{isEditMode ? 'Editar Registro Diário' : 'Novo Registro Diário'}</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form.Group className="mb-3">
              <Form.Label htmlFor="dataRegistroInput">Data do Registro</Form.Label>
              <Form.Control type="date" id="dataRegistroInput" value={dataRegistro} onChange={(e) => setDataRegistro(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="humorSelect">Humor</Form.Label>
              <Form.Select id="humorSelect" value={humor} onChange={(e) => setHumor(e.target.value)} required>
                <option value="">Selecione seu humor</option>
                <option value="1">Feliz</option>
                <option value="2">Produtivo</option>
                <option value="3">Normal</option>
                <option value="4">Ansioso</option>
                <option value="5">Estressado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="horasCelularInput">Horas de Celular</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                id="horasCelularInput"
                placeholder="Ex: 3.5"
                value={horasCelular}
                onChange={(e) => setHorasCelular(e.target.value)}
                required
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="tipoAtividadeSelect">Tipo de Atividade</Form.Label>
              <Form.Select
                id="tipoAtividadeSelect"
                value={tipoAtividade}
                onChange={(e) => setTipoAtividade(e.target.value)}
                required
              >
                <option value="">Selecione o tipo de atividade</option>
                <option value="1">Trabalho</option>
                <option value="2">Estudos</option>
                <option value="3">Exercício</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button variant={isEditMode ? 'warning' : 'info'} type="submit" disabled={loading}>
                {loading ? (isEditMode ? 'Atualizando...' : 'Salvando...') : (isEditMode ? 'Atualizar Registro' : 'Salvar Registro')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default DailyRecordPage;