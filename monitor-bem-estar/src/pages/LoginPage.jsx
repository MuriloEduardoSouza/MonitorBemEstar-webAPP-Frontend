import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
        setError(errorData.errors?.Senha?.[0] || errorData.message || 'Credenciais inválidas.');
        console.error('Erro de login:', response.status, errorData);
        return;
      }

      const data = await response.json();
      console.log('Login bem-sucedido!', data);

      localStorage.setItem('authToken', data.token);

       if (onLoginSuccess) {
        onLoginSuccess();
      }

      navigate('/dashboard');

    } catch (error){
      console.error('Erro na requisição', error);
      setError('Não foi possivel conectar ao servidor. Tente novamente mais tarde.');
    }
  };

   return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-header text-center bg-primary text-white">
              <h3>Login no Monitor de Bem-Estar</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Exibe mensagens de erro, se houver */}
                {error && <div className="alert alert-danger" role="alert">{error}</div>}

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
                  <label htmlFor="passwordInput" className="form-label">Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Entrar
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <small>
                Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link> 
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;