# Concejo Hospedería × Turneo — Demo desplegable

## Stack
- React + Vite (frontend)
- Resend (envío de email real)
- Vercel / Netlify (despliegue gratuito en 2 minutos)

## Pasos para desplegar

### 1. Crea una cuenta en Resend (gratis)
- Ve a https://resend.com y regístrate
- Ve a API Keys → Create API Key
- Copia la clave (empieza por `re_...`)

### 2. Sube el código a GitHub
- Crea un repo nuevo en github.com
- Sube esta carpeta

### 3. Despliega en Vercel
- Ve a https://vercel.com → New Project → importa tu repo
- En Environment Variables añade:
  RESEND_API_KEY = re_xxxxxxxxxxxx
  FROM_EMAIL = bookings@tudominio.com  (o usa onboarding@resend.dev para pruebas sin dominio)
- Deploy → listo

### 4. Para usar con tu dominio propio
- En Resend → Domains → Add Domain → sigue las instrucciones DNS
- Cambia FROM_EMAIL al email de tu dominio

## Desarrollo local
```
npm install
npm run dev
```
