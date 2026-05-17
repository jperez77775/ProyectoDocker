# Proyecto Docker

Instrucciones de ejecución del proyecto.

Paso 1: Autenticación en Docker Hub
Antes de compilar o subir cualquier cosa, debes iniciar sesión en tu cuenta de Docker Hub desde la terminal. Esto le dará permisos a tu máquina para subir imágenes a tu perfil. En mi caso use mi cuenta fullstack2026.
Ejecuta este comando en tu terminal de Windows:
docker login
•	Username: Introduce tu usuario de Docker Hub (en mi caso, fullstack2026).
•	Password: Introduce tu contraseña (o tu Token de acceso si tienes activada la seguridad de dos factores).
Si todo sale bien, la terminal te mostrará un mensaje confirmando: Login Succeeded.
________________________________________
Paso 2: Limpieza Absoluta de Contenedores Previos
Para asegurarnos de que la base de datos no tenga rastros de estructuras antiguas o corruptas, eliminamos el entorno actual borrando los volúmenes físicos:
docker compose down -v
________________________________________
Paso 3: Construcción de Imágenes Locales (Sin Caché)
Compilamos el Frontend y el Backend, asegurándonos de etiquetarlos correctamente con tu repositorio de Docker Hub:
Para el Backend:
cd C:\Proyecto\backend (la carpeta de tu proyecto backend)
docker build --no-cache -t docker.io/fullstack2026/perez-backend:v1 .
Para el Frontend:
cd ..\frontend
docker build --no-cache -t docker.io/fullstack2026/perez-frontend:v1 .
________________________________________

Paso 4: Subir las Imágenes a tu Repositorio de Docker Hub
Con las imágenes construidas y testeadas localmente, las subimos a la nube pública de Docker Hub. Esto es vital para que el proyecto sea portátil y se pueda ejecutar en cualquier otra máquina:
docker push docker.io/fullstack2026/perez-backend:v1
docker push docker.io/fullstack2026/perez-frontend:v1
________________________________________
Paso 5: Despliegue Final Automatizado
Regresamos a la carpeta raíz del proyecto e inicializamos toda la arquitectura. 
Usaremos la bandera --pull always para garantizar que Docker Compose descargue las últimas versiones que acabas de subir:
cd ..
docker compose up -d --pull always
________________________________________
¿Cómo verificar que tu proyecto funciona?
1.	Monitorear el arranque: Espera unos 45 segundos para darle tiempo a MySQL de procesar tu nuevo init.sql y quedar en estado Healthy.

2.	Revisar los Logs del Servidor: Ejecuta docker compose logs backend para asegurarte de que aparezca el mensaje de éxito: 
¡Conectado exitosamente a la base de datos MySQL!.
3.	Validación en el Navegador: Abre una pestaña en tu navegador e ingresa a:
o	🌐 http://localhost:4000/cv (Para verificar el JSON limpio y nativo).
o	💻 http://localhost:3000 (Para ver la interfaz de usuario)



