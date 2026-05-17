const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 4000; 

let db = null;
let isConnecting = false;

const connectWithRetry = () => {
  if (isConnecting) return; 
  isConnecting = true;

  console.log('Intentando conectar a la base de datos MySQL...');
  
  if (db) {
    try { db.destroy(); } catch(e) {}
  }

  db = mysql.createConnection({
    host: 'database', 
    user: 'root',
    password: 'rootpassword',
    database: 'cv_db',
    charset: 'utf8mb4'
  });

  db.connect((err) => {
    isConnecting = false; 

    if (err) {
      console.error('Error al conectar a MySQL, reintentando en 5 segundos...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('¡Conectado exitosamente a la base de datos MySQL!');
      db.query("SET NAMES utf8mb4;");
    }
  });

  db.on('error', (err) => {
    isConnecting = false;
    console.error('Error crítico detectado en el cliente MySQL:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
      connectWithRetry();
    }
  });
};

connectWithRetry();

// Endpoint para el CV
app.get('/cv', (req, res) => {
  const queryPersona = 'SELECT * FROM persona LIMIT 1';
  const queryFormacion = 'SELECT * FROM formacion';

  if (!db || isConnecting) {
    return res.status(503).json({ error: 'La base de datos se está reconectando.' });
  }

  db.query(queryPersona, (err, personaRes) => {
    if (err) return res.status(500).json(err);
    
    db.query(queryFormacion, (err, formacionRes) => {
      if (err) return res.status(500).json(err);
      
      if (personaRes.length === 0) {
        return res.status(404).json({ message: "No se encontraron datos" });
      }

      // 🛠️ PARCHE MAESTRO BINARIO: 
      // Detecta si el string se rompió al convertirse en Latin1/ISO y lo reconstruye a UTF-8 real
      const sanearTexto = (texto) => {
        if (!texto) return texto;
        const buffer = Buffer.from(texto, 'binary');
        // Si al leerlo como binario detecta la estructura corrupta de PÃ©rez, la repara
        return buffer.toString('utf8');
      };

      const formacionCorregida = formacionRes.map(f => ({
        ...f,
        titulo: sanearTexto(f.titulo),
        institucion: sanearTexto(f.institucion)
      }));

      const cv = {
        nombre: sanearTexto(personaRes[0].nombre),
        apellido: sanearTexto(personaRes[0].apellido),
        ciudad: sanearTexto(personaRes[0].ciudad),
        foto: personaRes[0].foto,
        formacion: formacionCorregida
      };

      // Enviamos el contenido forzando la lectura limpia del navegador
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(JSON.stringify(cv));
    });
  });
});

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});