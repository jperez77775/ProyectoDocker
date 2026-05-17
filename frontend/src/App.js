import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [cvData, setCvData] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let timer;

    const cargarDatos = () => {
      // Intentar consumir el servicio REST unificado
      axios.get('http://localhost:4000/cv')
        .then(response => {
          setCvData(response.data);
          setIsRetrying(false); // Conexión exitosa, apagamos la alerta de espera
        })
        .catch(err => {
          console.log("El backend aún no está listo, reintentando en 3 segundos...", err);
          setIsRetrying(true); // Activamos el estado de espera amigable
          // Volver a intentar de forma automática en 3 segundos
          timer = setTimeout(cargarDatos, 3000);
        });
    };

    cargarDatos();

    // Limpieza al desmontar el componente
    return () => clearTimeout(timer);
  }, []);

  // 1. ESTADO DE ESPAÑA ACTIVA: El backend o la base de datos se están levantando en Docker
  if (isRetrying && !cvData) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', textAlign: 'center' 
      }}>
        <div style={{
          border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%',
          width: '40px', height: '40px', animation: 'spin 1s linear infinite', marginBottom: '20px'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h3 style={{ color: '#2c3e50', margin: '5px 0' }}>Estableciendo conexión con los servicios...</h3>
        <p style={{ color: '#7f8c8d', maxWidth: '400px', fontSize: '14px' }}>
          La infraestructura de Docker se está sincronizando. El Frontend se conectará automáticamente en cuanto el Backend y MySQL terminen de iniciar.
        </p>
      </div>
    );
  }

  // 2. ESTADO INICIAL: Cargando la primera petición
  if (!cvData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#7f8c8d' }}>
        Iniciando aplicación...
      </div>
    );
  }

  // 3. ESTADO EXITOSO: Renderizado del CV con codificación correcta
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '40px' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
        <img 
          src={cvData.foto} 
          alt="Perfil" 
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #eee' }} 
        />
        <h1>{cvData.nombre} {cvData.apellido}</h1>
        <p><strong>Ciudad:</strong> {cvData.ciudad}</p>
      </header>

      <section style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#2c3e50' }}>Formación Académica</h2>
        <ul style={{ lineHeight: '1.8', fontSize: '16px', color: '#34495e' }}>
          {cvData.formacion && cvData.formacion.map((item) => (
            <li key={item.id} style={{ marginBottom: '8px' }}>
              <strong>{item.titulo}</strong> - {item.institucion} ({item.anio})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;