// src/components/common/LayoutComponent.jsx
import React from 'react';
import HeaderComponent from './HeaderComponent';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons'; 

function LayoutComponent({ children, onLogout }) {
  return (
    <>
      <HeaderComponent onLogout={onLogout} />
      <main className="py-4">
        <div className="container">
          {children}
        </div>
      </main>

      <div 
        className="position-fixed" 
        style={{ 
          top: '85px',           
          right: '25px',           
          zIndex: 1000             
        }}
      >
        <Button 
          as={Link}             
          to="/daily-record"     
          variant="primary"      
          className="rounded-circle shadow-lg fab-new-record" 
        >
          <FontAwesomeIcon icon={faPlus} size="2x" /> 
        </Button>
      </div>
    </>
  );
}

export default LayoutComponent;