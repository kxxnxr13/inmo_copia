# 🚀 Guía Completa: Inmobiliaria en Visual Studio Code

## 📋 Prerrequisitos

Antes de empezar, asegúrate de tener instalado:

1. **Node.js** (versión 16 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica con: `node --version`

2. **Git**
   - Descarga desde: https://git-scm.com/
   - Verifica con: `git --version`

3. **Visual Studio Code**
   - Descarga desde: https://code.visualstudio.com/

## 🔄 Paso 1: Clonar el Repositorio

```bash
# Clona el proyecto
git clone [URL_DE_TU_REPOSITORIO]

# Entra al directorio
cd inmobiliaria-project
```

## 🔧 Paso 2: Configurar Visual Studio Code

### Extensiones Recomendadas:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

### Instalar extensiones:
1. Abre VS Code
2. Ve a Extensions (Ctrl+Shift+X)
3. Busca e instala las extensiones mencionadas

## 📦 Paso 3: Instalar Dependencias

```bash
# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install

# Volver al directorio raíz
cd ..
```

## ⚙️ Paso 4: Configurar Variables de Entorno

Crea el archivo `.env` en la carpeta `backend`:

```bash
# backend/.env
DATABASE_URL=postgresql://postgres:Keiner*13***@db.hsgvipzswbanogfnxlyo.supabase.co:5432/postgres
DB_HOST=db.hsgvipzswbanogfnxlyo.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Keiner*13***
JWT_SECRET=un_secreto_seguro_para_supabase_2024
PORT=8000
```

## 🚀 Paso 5: Ejecutar el Proyecto

### Opción A: Ejecutar por separado (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
- Se ejecutará en: http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
- Se ejecutará en: http://localhost:3000

### Opción B: Script automatizado

Crea un script en el directorio raíz:

**package.json** (en la raíz):
```json
{
  "name": "inmobiliaria-fullstack",
  "scripts": {
    "dev": "concurrently \"cd backend && npm start\" \"cd frontend && npm start\"",
    "install-all": "cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

Ejecutar:
```bash
npm install
npm run dev
```

## 🖥️ Paso 6: Acceder a la Aplicación

### Frontend (Usuario)
- **URL**: http://localhost:3000
- **Funciones**: Ver propiedades, formulario de contacto

### Backend API
- **URL**: http://localhost:8000
- **Endpoints**: /api/auth, /api/properties, /api/users

### Panel de Administración
- **URL**: http://localhost:3000 → "Acceso empleados"
- **Credenciales**:
  ```
  Email: admin@inmobiliaria.com
  Contraseña: admin123
  
  Email: superadmin@inmobiliaria.com
  Contraseña: admin123
  ```

## 🧪 Paso 7: Probar Funcionalidades

### Como Usuario:
1. Navega por las propiedades
2. Usa el formulario de búsqueda
3. Envía formularios de contacto

### Como Administrador:
1. **Login**: Accede con las credenciales de admin
2. **Usuarios**: Crear/editar usuarios del sistema
3. **Propiedades**: Crear, editar, eliminar propiedades
4. **Imágenes**: Subir imágenes para propiedades
5. **Contactos**: Ver formularios de contacto recibidos

## 🔍 Paso 8: Debugging en VS Code

### Configurar debugger:

Crea `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

### Usar debugger:
1. Coloca breakpoints en tu código
2. F5 para iniciar debugging
3. Usa la consola para inspeccionar variables

## 📊 Paso 9: Ver Base de Datos (Supabase)

### Dashboard de Supabase:
- **URL**: https://supabase.com/dashboard
- **Proyecto**: hsgvipzswbanogfnxlyo
- **Ver tablas**: Users, Properties, ContactRequests

### Verificar conexión:
```bash
cd backend
node -e "
const db = require('./config/db');
db.authenticate()
  .then(() => console.log('✅ Conexión exitosa'))
  .catch(err => console.error('❌ Error:', err));
"
```

## 🛠️ Comandos Útiles

```bash
# Ver logs del backend
cd backend && npm start

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ver estado de git
git status

# Hacer commit de cambios
git add .
git commit -m "Descripción del cambio"
git push
```

## 🎯 Resultados Esperados

### ✅ Frontend funcionando:
- Página principal con búsqueda
- Lista de propiedades
- Formularios de contacto
- Panel de administración

### ✅ Backend funcionando:
- API REST operativa
- Autenticación JWT
- CRUD de propiedades
- Upload de imágenes

### ✅ Base de datos:
- Conexión a Supabase
- Tablas creadas automáticamente
- Datos persistentes

## 🚨 Troubleshooting

### Puerto ocupado:
```bash
# Matar proceso en puerto 3000
npx kill-port 3000

# Matar proceso en puerto 8000
npx kill-port 8000
```

### Error de dependencias:
```bash
# Limpiar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error de conexión DB:
- Verifica las credenciales en `.env`
- La app funcionará en modo memoria si no puede conectar
- En producción se conectará automáticamente

---

## 🎉 ¡Todo Listo!

Tu aplicación inmobiliaria está lista para desarrollo y producción con:
- ✅ React frontend
- ✅ Express backend
- ✅ Supabase PostgreSQL
- ✅ Sistema de autenticación
- ✅ Upload de imágenes
- ✅ Panel administrativo completo
