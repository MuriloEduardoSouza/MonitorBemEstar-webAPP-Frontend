import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idade, setIdade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage(''); 

    
    if (password !== confirmPassword) {
      setError('A senha e a confirmação de senha não coincidem.');
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
        console.error('Erro de cadastro:', response.status, errorData);
        return;
      }

      
      setSuccessMessage('Cadastro realizado com sucesso! Você já pode fazer login.');
     
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
          <div className="card shadow-lg">
            <div className="card-header text-center bg-success text-white">
              <h3>Cadastre-se no Monitor de Bem-Estar</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}

                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Idade</label>
                  <input
                    type="number"
                    className="form-control"
                    id="idadeInput"
                    placeholder="Sua idade"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Endereco</label>
                  <input
                    type="text"
                    className="form-control"
                    id="enderecoInput"
                    placeholder="Seu endereço"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPasswordInput" className="form-label">Confirmar Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPasswordInput"
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button type="submit" className="btn btn-success btn-lg">
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <small>
                Já tem uma conta? <Link to="/login">Faça Login</Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;