import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Form, Button, Card, Alert, Spinner, InputGroup } from 'react-bootstrap'; 
import { HumorMap, TipoAtividadeMap } from '../utils/enumMappings';
import { toast } from 'react-toastify';

/* Fontes */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* Icones */
import { faUser, faHeartbeat, faCalendarDay, faSmileBeam, faMobileAlt, faRunning } from '@fortawesome/free-solid-svg-icons';

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
  const navigate = useNavigate();

  
  useEffect(() => {
    if (isEditMode) {
      const fetchRecordToEdit = async () => {
        setInitialDataLoading(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
          toast.error('Você não está autenticado. Por favor, faça login.');
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
            toast.error(errorData.message || `Erro ao carregar registro para edição: ${response.status}`);
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
          toast.error('Não foi possível carregar o registro para edição. Tente novamente mais tarde.');
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

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Você não está autenticado. Por favor, faça login.');
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
        toast.error("Por favor, preencha todos os campos obrigatórios com valores válidos.");
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
          toast.error('Sessão expirada ou não autorizada. Faça login novamente.');
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

      toast.success(`Registro diário ${isEditMode ? 'atualizado' : 'salvo'} com sucesso!`);
      if (!isEditMode) {
        setDataRegistro('');
        setHumor('');
        setHorasCelular('');
        setTipoAtividade('');
      }
    
      setTimeout(() => navigate('/historico'), 1500); 

    } catch (err) {
      console.error('Erro na requisição:', err);
      toast.error('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
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
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

      <Card className="shadow-lg">
        <Card.Header className={`text-center ${isEditMode ? 'bg-warning' : 'bg-primary'} text-white`} >
          <h3>{isEditMode ? 'Editar Registro Diário' : 'Novo Registro Diário'}</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="dataRegistroInput">Data do Registro</Form.Label>
               <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarDay} /></InputGroup.Text> 
                    <Form.Control type="date" id="dataRegistroInput" value={dataRegistro} onChange={(e) => setDataRegistro(e.target.value)} required />
                  </InputGroup>
            </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="humorSelect">Humor</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={faSmileBeam} /></InputGroup.Text> 
                    <Form.Select id="humorSelect" value={humor} onChange={(e) => setHumor(e.target.value)} required>
                      <option value="">Selecione seu humor</option>
                      {Object.entries(HumorMap).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="horasCelularInput">Horas de Celular</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faMobileAlt} /></InputGroup.Text> 
                    <Form.Control type="number" step="0.01" id="horasCelularInput" placeholder="Ex: 3.5" value={horasCelular} onChange={(e) => setHorasCelular(e.target.value)} required min="0" />
                  </InputGroup>
                </Form.Group>

             
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="tipoAtividadeSelect">Tipo de Atividade</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faRunning} /></InputGroup.Text> 
                    <Form.Select id="tipoAtividadeSelect" value={tipoAtividade} onChange={(e) => setTipoAtividade(e.target.value)} required>
                      <option value="">Selecione o tipo de atividade</option>
                      {Object.entries(TipoAtividadeMap).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
                
            <div className="d-grid gap-2 mt-4">
              <Button variant={isEditMode ? 'warning' : 'info'} type="submit" disabled={loading} id='btnSlvRegistro'>
                {loading ? (isEditMode ? 'Atualizando...' : 'Salvando...') : (isEditMode ? 'Atualizar Registro' : 'Salvar Registro')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      </div>
    </div>
  </div>
  );
}

export default DailyRecordPage;