// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify'; 

function UserProfilePage() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [idade, setIdade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState(''); 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(''); 
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
    
      const token = localStorage.getItem('authToken');

      if (!token) {
        toast.error('Você não está autenticado. Por favor, faça login.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://localhost:7071/api/usuarios/me', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error('Sessão expirada ou não autorizada. Faça login novamente.');
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
          const errorData = await response.json();
          toast.error(errorData.message || `Erro ao carregar perfil: ${response.status}`);
          console.error('Erro ao carregar perfil:', response.status, errorData);
          return;
        }

        const data = await response.json();
        setNomeCompleto(data.nomeCompleto || '');
        setIdade(data.idade.toString() || '');
        setEndereco(data.endereco || '');
        setEmail(data.email || '');

      } catch (err) {
        console.error('Erro na requisição de carregamento:', err);
        setError('Não foi possível carregar o perfil. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Você não está autenticado. Por favor, faça login.');
      setSaving(false);
      navigate('/login');
      return;
    }

    const profileData = {
      nomeCompleto: nomeCompleto,
      idade: parseInt(idade, 10),
      endereco: endereco,
    };

    if (!profileData.nomeCompleto || isNaN(profileData.idade) || !profileData.endereco) {
      toast.error('Por favor, preencha todos os campos corretamente.');
      setSaving(false);
      return;
    }
    if (profileData.idade < 0 || profileData.idade > 120) {
      toast.error('A idade deve estar entre 0 e 120.');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('https://localhost:7071/api/usuarios/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error('Sessão expirada ou não autorizada. Faça login novamente.');
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        let errorMessage = 'Erro ao atualizar perfil.';
        if (errorData.errors) {
            errorMessage = Object.values(errorData.errors).flat().join(' ');
        } else if (errorData.message) {
            errorMessage = errorData.message;
        }
        toast.error(errorMessage);
        console.error('Erro ao atualizar perfil:', response.status, errorData);
        return;
      }

      toast.success('Perfil atualizado com sucesso!'); 
      
    } catch (err) {
      console.error('Erro na requisição:', err);
      toast.error('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-5">
      <Card className="shadow-lg">
        <Card.Header className="text-center bg-primary text-white">
          <h3>Meu Perfil</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} readOnly disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="nomeCompletoInput">Nome Completo</Form.Label>
              <Form.Control type="text" id="nomeCompletoInput" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="idadeInput">Idade</Form.Label>
              <Form.Control type="number" id="idadeInput" value={idade} onChange={(e) => setIdade(e.target.value)} required min="0" max="120" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="enderecoInput">Endereço</Form.Label>
              <Form.Control type="text" id="enderecoInput" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserProfilePage;