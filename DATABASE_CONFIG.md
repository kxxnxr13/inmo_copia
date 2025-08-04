# 🗄️ CONFIGURACIÓN DE BASE DE DATOS REAL

## ✅ ESTADO ACTUAL
- ✅ **Sistema híbrido configurado**: Funciona con BD real o memoria
- ✅ **Controladores actualizados**: Detectan automáticamente si hay BD disponible
- ✅ **Fallback funcional**: Si falla la BD, usa datos en memoria
- ✅ **Logs detallados**: Te dice si está usando BD o memoria

---

## 🚀 OPCIONES DE BASE DE DATOS EN LA NUBE

### **OPCIÓN 1: Supabase (PostgreSQL) - RECOMENDADA**
```
✅ GRATIS hasta 500MB
✅ Dashboard visual incluido
✅ Muy fácil de configurar
✅ Backup automático
```

**Pasos:**
1. Ve a https://supabase.com
2. Crea cuenta gratuita
3. "New Project" → Nombre: `inmobiliaria-leal`
4. Copia la URL de conexión
5. Usa estas variables de entorno:

```env
# Para PostgreSQL (Supabase)
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=tu_password_supabase
DB_HOST=db.tu_proyecto.supabase.co
DB_PORT=5432
DB_DIALECT=postgres
```

### **OPCIÓN 2: PlanetScale (MySQL)**
```
✅ GRATIS hasta 10GB
✅ Compatible con código actual
✅ Escalable sin límites
```

**Pasos:**
1. Ve a https://planetscale.com
2. Crea cuenta gratuita
3. "New Database" → Nombre: `inmobiliaria-leal`
4. Copia la cadena de conexión
5. Usa estas variables:

```env
# Para MySQL (PlanetScale)
DB_NAME=inmobiliaria_leal
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=tu_host.psdb.cloud
DB_PORT=3306
DB_DIALECT=mysql
```

### **OPCIÓN 3: Railway (PostgreSQL/MySQL)**
```
✅ GRATIS con límites generosos
✅ Deploy automático
✅ Múltiples tipos de BD
```

**Pasos:**
1. Ve a https://railway.app
2. Conecta tu GitHub
3. "New Project" → "Database" → "PostgreSQL"
4. Copia las variables de conexión

---

## 🔧 CONFIGURACIÓN LOCAL (phpMyAdmin)

Si prefieres usar MySQL local con phpMyAdmin:

### **Paso 1: Crear Base de Datos**
1. Abre phpMyAdmin
2. "Nueva" → Nombre: `inmobiliaria_leal`
3. Cotejamiento: `utf8mb4_unicode_ci`

### **Paso 2: Ejecutar SQL**
Ejecuta el contenido del archivo `database_setup.sql` que está en la raíz del proyecto.

### **Paso 3: Variables de Entorno**
```env
# Para MySQL Local
DB_NAME=inmobiliaria_leal
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql
```

---

## ⚙️ CÓMO ACTIVAR LA BASE DE DATOS

### **Método 1: Variables de Entorno (Recomendado)**
Usa el DevServerControl para configurar las variables:

```javascript
// Ejemplo para Supabase
DB_NAME=postgres
DB_USER=postgres  
DB_PASSWORD=tu_password
DB_HOST=db.proyecto.supabase.co
DB_DIALECT=postgres
```

### **Método 2: Archivo .env**
Edita `backend/.env`:

```env
# Agrega estas líneas
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=tu_host
DB_PORT=5432
DB_DIALECT=postgres
```

---

## 🧪 CÓMO VERIFICAR QUE FUNCIONA

### **1. Revisa los logs del servidor**
Cuando arranque, verás:
```
✅ Upload middleware loaded
Auth routes loaded
💾 Database connection successful!
✅ Models synchronized with database
```

### **2. En las respuestas de la API**
```json
{
  "success": true,
  "properties": [...],
  "source": "database"  // ← Esto indica que está usando BD real
}
```

### **3. Crea una propiedad nueva**
- Ve al dashboard de admin
- Crea una nueva propiedad
- Reinicia el servidor
- Si la propiedad sigue ahí, ¡la BD está funcionando!

---

## 🔄 MIGRACIÓN DE DATOS EXISTENTES

Una vez que configures la BD real, los datos actuales se migrarán automáticamente porque:

1. **Datos en memoria se mantienen**: Mientras no reinicies
2. **Nuevos datos van a BD**: Automáticamente
3. **Fallback inteligente**: Si falla la BD, vuelve a memoria

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **Error de conexión**
Si ves logs como:
```
❌ Database error, falling back to test users
🧠 Using memory storage
```

**Soluciones:**
1. Verifica las variables de entorno
2. Chequea que la BD esté activa
3. Confirma usuario/password correctos
4. Revisa firewall/IP whitelist

### **El sistema sigue usando memoria**
En los logs verás:
```
🧠 Using memory storage
```

Esto significa que no puede conectar a la BD. Revisa la configuración.

---

## 💡 RECOMENDACIÓN

**Para empezar rápido**: Usa **Supabase**
1. Es gratis
2. Setup en 5 minutos  
3. Dashboard visual incluido
4. No necesitas configurar nada local

¿Quieres que te ayude a configurar Supabase paso a paso?
