import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

/* Fontes */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* Icones */
import { faUser, faEnvelope, faCalendarAlt, faMapMarkerAlt, faLock, faHeartbeat } from '@fortawesome/free-solid-svg-icons';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idade, setIdade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('A senha e a confirmação de senha não coincidem.');
      toast.error('A senha e a confirmação de senha não coincidem.');
      return;
    }

    
    const registrationData = {
      UserName: email,
      NomeCompleto: name, 
      Idade: parseInt(idade, 10),
      Endereco: endereco,
      Email: email,
      Senha: password 
    };

    try {
     
      const response = await fetch('https://localhost:7071/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        
        const errorData = await response.json();
        let errorMessage = 'Erro ao tentar cadastrar.';
        
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join(' ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Erro de cadastro:', response.status, errorData);
        return;
      }

      toast.success('Cadastro realizado com sucesso! Você ja pode fazer login.');
     
      setName('');
      setEmail('');
      setIdade('');
      setEndereco('');
      setPassword('');
      setConfirmPassword('');

     
      setTimeout(() => {
        navigate('/login');
      }, 2000); 

    } catch (error) {
      console.error('Erro na requisição:', error);
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  };

  return (
   <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <Card className="shadow-lg">
            <Card.Header className="text-center bg-success text-white py-3"> {/* py-3 para um padding vertical */}
              <h3 className="mb-0 d-flex align-items-center justify-content-center"> {/* mb-0 para remover margem, d-flex para alinhar */}
                <FontAwesomeIcon icon={faHeartbeat} className="me-2" size="lg" /> {/* <-- Ícone do logo aqui */}
                Cadastre-se
              </h3>
            </Card.Header>


            <Card.Body>
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="nameInput">Nome Completo</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faUser} /></InputGroup.Text> 
                    <Form.Control type="text" id="nameInput" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="emailInput">Email</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text> 
                    <Form.Control type="email" id="emailInput" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </InputGroup>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="idadeInput">Idade</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text> 
                    <Form.Control type="number" id="idadeInput" placeholder="Sua idade" value={idade} onChange={(e) => setIdade(e.target.value)} required />
                  </InputGroup>
                </Form.Group>
            
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="enderecoInput">Endereço</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faMapMarkerAlt} /></InputGroup.Text> 
                    <Form.Control type="text" id="enderecoInput" placeholder="Seu endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="passwordInput">Senha</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text> 
                    <Form.Control type="password" id="passwordInput" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="confirmPasswordInput">Confirmar Senha</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text> 
                    <Form.Control type="password" id="confirmPasswordInput" placeholder="Repita sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6" />
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-success btn-lg">
                    Cadastrar
                  </button>
                </div>
              </form>
            </Card.Body>

            <Card.Footer className="text-center">
              <small>
                Já tem uma conta? <Link to="/login">Faça Login</Link>
              </small>
            </Card.Footer>
            
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;