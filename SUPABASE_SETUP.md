# 🚀 CONFIGURACIÓN SUPABASE - PASO A PASO

## ✅ ¿QUÉ SE HA CAMBIADO?

- ❌ **Eliminado**: MySQL, mysql2, configuración antigua
- ✅ **Agregado**: PostgreSQL, pg, pg-hstore
- ✅ **Configurado**: Sequelize para Supabase
- ✅ **Actualizado**: Variables de entorno

---

## 📋 PASO 1: CREAR CUENTA EN SUPABASE

1. Ve a: **https://supabase.com**
2. Clic en **"Start your project"**
3. **"Sign up"** con GitHub (recomendado)
4. Autoriza Supabase en GitHub

---

## 📋 PASO 2: CREAR PROYECTO

1. Clic en **"New Project"**
2. **Organization**: Selecciona la organización personal
3. **Name**: `inmobiliaria-leal`
4. **Database Password**: Crea una contraseña FUERTE (guárdala)
5. **Region**: `South America (São Paulo)`
6. Clic en **"Create new project"**
7. **Espera 2-3 minutos** mientras se crea

---

## 📋 PASO 3: OBTENER CREDENCIALES

1. En tu proyecto, ve a **"Settings"** (⚙️)
2. Clic en **"Database"**
3. Busca la sección **"Connection parameters"**
4. Copia estos valores:

```
Host: db.xxxxxxxxxxxxxx.supabase.co
Database name: postgres  
Port: 5432
User: postgres
Password: [la que creaste]
```

---

## 📋 PASO 4: CONFIGURAR TU APLICACIÓN

### Opción A: Con URL completa (RECOMENDADO)
```bash
DATABASE_URL=postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_REF].supabase.co:5432/postgres
```

### Opción B: Variables separadas
```bash
DB_HOST=db.[TU_PROJECT_REF].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[TU_PASSWORD]
```

---

## 📋 PASO 5: APLICAR CONFIGURACIÓN

### Método 1: Variables de entorno (Recomendado)
Usa este comando en tu terminal:

\`\`\`javascript
// En la consola del navegador o usando DevServerControl
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
\`\`\`

### Método 2: Archivo .env
Edita `backend/.env` y reemplaza:

\`\`\`env
DATABASE_URL=postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_REF].supabase.co:5432/postgres
PORT=8000
JWT_SECRET=un_secreto_seguro_para_supabase_2024
\`\`\`

---

## 📋 PASO 6: PROBAR LA CONEXIÓN

1. **Reinicia el servidor**
2. Revisa los logs, deberías ver:
```
✅ Upload middleware loaded
Auth routes loaded
💾 Database connection successful!
✅ Models synchronized with database
Servidor corriendo en puerto 8000
```

3. **Si ves errores**, revisa que:
   - La contraseña sea correcta
   - El PROJECT_REF sea correcto
   - No tengas espacios extra en las variables

---

## 📋 PASO 7: VERIFICAR QUE FUNCIONA

### 1. Crear usuario admin
El sistema creará automáticamente:
- Email: `admin@inmobiliaria.com`
- Password: `admin123`

### 2. Probar login
- Ve al frontend
- Inicia sesión con las credenciales
- Si funciona, ¡la BD está conectada!

### 3. Ver datos en Supabase
- Ve a tu proyecto Supabase
- Clic en **"Table Editor"**
- Verás las tablas: `Users`, `Properties`, `ContactRequests`

---

## 🔍 EJEMPLO REAL DE CONFIGURACIÓN

Si tu proyecto se llama `abc123def456`, tu configuración sería:

\`\`\`env
DATABASE_URL=postgresql://postgres:MiPassword123@db.abc123def456.supabase.co:5432/postgres
\`\`\`

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Error: "connect ECONNREFUSED"
✅ Revisa que la URL sea correcta
✅ Verifica que el proyecto esté activo en Supabase
✅ Confirma que la contraseña no tenga caracteres especiales

### Error: "password authentication failed"
✅ Verifica la contraseña
✅ Resetea la contraseña en Supabase → Settings → Database

### Error: "timeout"
✅ Cambia la región más cercana
✅ Revisa tu conexión a internet

---

## 🎯 VENTAJAS DE SUPABASE

✅ **Gratis hasta 500MB**
✅ **Dashboard visual incluido**
✅ **Backups automáticos**
✅ **Escalable fácilmente**
✅ **Compatible con PostgreSQL**
✅ **No requiere configuración local**

---

## 📞 ¿NECESITAS AYUDA?

1. **Copia y pega** tu URL de conexión (SIN la contraseña)
2. **Comparte** los logs de error si los hay
3. **Menciona** en qué paso te quedaste

¡Tu aplicación inmobiliaria estará lista en minutos!
