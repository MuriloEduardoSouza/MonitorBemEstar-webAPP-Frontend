// src/components/common/LayoutComponent.jsx
import React from 'react';
import HeaderComponent from './HeaderComponent'; 

function LayoutComponent({ children, onLogout }) {
  return (
    <>
    
      <HeaderComponent onLogout={onLogout} /> 
      <main className="py-4"> 
        <div className="container">
          {children} {/* Aqui serão renderizados os componentes da página (DashboardPage, etc.) */}
        </div>
      </main>
      
    </>
  );
}

export default LayoutComponent;