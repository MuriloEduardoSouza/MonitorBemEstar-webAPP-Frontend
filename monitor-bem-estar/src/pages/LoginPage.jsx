import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

/* Fontes */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
/* Icones */
import { faEnvelope, faLock, faHeartbeat } from '@fortawesome/free-solid-svg-icons';

function LoginPage({ onLoginSuccess }) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError('');
    

    try{
      const response = await fetch ('https://localhost:7071/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email,Senha: password }),
      });

      if (!response.ok){

       const errorData = await response.json();
        toast.error(errorData.errors?.Senha?.[0] || errorData.message || 'Credenciais inválidas.');
        console.error('Erro de login:', response.status, errorData);
        return;
      }

      const data = await response.json();
      toast.success('Login bem-sucedido!', data);

      localStorage.setItem('authToken', data.token);

       if (onLoginSuccess) {
        onLoginSuccess();
      }
      toast.success('Login efetuado com sucesso!');
      navigate('/dashboard');

    } catch (error){
      console.error('Erro na requisição', error);
      toast.error('Não foi possivel conectar ao servidor. Tente novamente mais tarde.');
    }
  };

   return (
    <div className="container" id='TelaLogin'>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <Card.Header className="text-center bg-primary text-white py-3"> {/* py-3 para um padding vertical */}
              <h3 className="mb-0 d-flex align-items-center justify-content-center"> {/* mb-0 para remover margem, d-flex para alinhar */}
                <FontAwesomeIcon icon={faHeartbeat} className="me-2" size="lg" /> {/* <-- Ícone do logo aqui */}
                Login 
              </h3>
            </Card.Header>


            <Card.Body>
              <form onSubmit={handleSubmit}>
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="emailInput">Email</Form.Label>
                  <InputGroup> 
                    <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text> 
                    <Form.Control type="email" id="emailInput" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="passwordInput">Senha</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text> 
                    <Form.Control type="password" id="passwordInput" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </InputGroup>
                </Form.Group>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Entrar
                  </button>
                </div>
              </form>
            </Card.Body>
            
           <Card.Footer className='text-center'>
              <small>
                Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link> 
              </small>
            </Card.Footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;