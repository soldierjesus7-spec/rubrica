# Backend de la Rúbrica de evaluación (MySQL)

Este servicio conecta el archivo `rubrica.html` con una base de datos MySQL real,
para que funcione fuera de claude.ai (por ejemplo, en Visual Studio Code o en un servidor propio).

## 1. Requisitos

- Node.js 18 o superior instalado.
- Un servidor MySQL corriendo (local o remoto) y sus credenciales.

## 2. Crear la base de datos

Con tu cliente MySQL (línea de comandos, MySQL Workbench, phpMyAdmin, etc.) ejecuta el archivo `schema.sql`:

```bash
mysql -u root -p < schema.sql
```

Esto crea la base `rubrica_evaluacion` con una sola tabla `kv_store` donde se guarda
toda la configuración (equipos, jurados, criterios, logo) y cada evaluación registrada.

## 3. Configurar las credenciales

Copia `.env.example` a `.env` y coloca tus datos reales:

```bash
cp .env.example .env
```

Edita `.env`:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=rubrica_evaluacion
PORT=3000
```

## 4. Instalar dependencias y arrancar

```bash
npm install
npm start
```

Si todo está bien verás:

```
API de la rúbrica escuchando en http://localhost:3000
```

## 5. Conectar el HTML a este backend

Abre `rubrica.html` y busca, cerca del inicio del `<script>`, esta línea:

```js
const API_BASE_URL = 'http://localhost:3000';
```

Déjala así si vas a correr todo en tu propio computador. Si subes este backend a un
servidor (por ejemplo Railway, Render, un VPS, etc.), cambia esa URL por la dirección
pública de tu servicio, por ejemplo:

```js
const API_BASE_URL = 'https://mi-backend-rubrica.onrender.com';
```

## 6. Abrir la app correctamente

No abras `rubrica.html` con doble clic (protocolo `file://`), porque algunos
navegadores bloquean las peticiones a la API en ese modo. En su lugar, sírvelo con
un servidor local sencillo, por ejemplo con la extensión **Live Server** de VS Code,
o desde la terminal:

```bash
npx serve .
```

y abre la URL que te indique (normalmente `http://localhost:3000` o `5000`,
distinta del puerto del backend).

## 7. Verificar que quedó conectado

Con el backend corriendo, abre `rubrica.html` en el navegador, ve a "Panel de
administrador" y agrega un equipo de prueba. Si aparece en la lista y sigue
apareciendo después de recargar la página, la conexión con MySQL quedó funcionando.

## Notas

- Todos los datos de la app (equipos, jurados, criterios, evaluaciones, logo del
  colegio) se guardan como filas en la tabla `kv_store`, igual que hacía el
  almacenamiento de claude.ai — por eso no fue necesario tocar la lógica interna
  de la app, solo la forma en que se comunica con el guardado.
- Este backend no tiene autenticación. Si vas a exponerlo en internet, considera
  agregar una capa de seguridad (contraseña de administrador, HTTPS, etc.).
