-- 1. Crear la base de datos especificando UTF-8 y ordenamiento en español de forma nativa
CREATE DATABASE IF NOT EXISTS cv_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_spanish_ci;

USE cv_db;

-- 2. Estructurar la tabla persona forzando el juego de caracteres
CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    ciudad VARCHAR(100),
    foto VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 3. Estructurar la tabla formación forzando el juego de caracteres
CREATE TABLE formacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    institucion VARCHAR(100),
    anio VARCHAR(50),
    persona_id INT,
    FOREIGN KEY (persona_id) REFERENCES persona(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 4. Insertar los datos 
INSERT INTO persona (nombre, apellido, ciudad, foto) 
VALUES ('Juan Eduardo', 'Pérez Orellana', 'Santa Cruz', '/perfil.jpg');

INSERT INTO formacion (titulo, institucion, anio, persona_id) 
VALUES ('Diplomado FullStack Developer Backend y Frontend ', 'USIP', '2026', 1),
       ('Gestión de Proyectos', 'Millicom University', '2014', 1),
       ('Arquitectura Enterprise: Oracle SOA Suite, WebLogic Server y Java EE', 'Oracle', '2011', 1),
       ('Maestría en Ciencias de la Computación ', 'UAGRM', '2006', 1),
       ('Ingeniería Informática', 'UAGRM', '1999', 1);