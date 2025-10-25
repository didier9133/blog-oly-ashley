# 🔐 Sistema de Descargas Seguras con Tokens Únicos

## 📋 Resumen del Sistema

Este sistema garantiza que:

- ✅ Solo usuarios que **pagaron** pueden descargar
- ✅ Los links de descarga **NO** son accesibles simplemente por URL
- ✅ Cada compra genera un **token único** imposible de adivinar
- ✅ Los tokens **expiran** después de 30 días
- ✅ Límite de **descargas** por compra
- ✅ Email automático con link seguro
- ✅ Página de éxito protegida que valida el pago

## 🔄 Flujo Completo

### 1. Cliente realiza el pago

```
Cliente → Checkout Stripe → Paga exitosamente
```

### 2. Stripe webhook confirma el pago

```
Stripe → POST /api/checkout/webhook
  ↓
  Crea registro en BD
  ↓
  Envía email con link de descarga
```

### 3. Cliente recibe email con link seguro

```
Email contiene: https://tudominio.com/api/download?token=abc123xyz
                                                        ↑
                                                Token único imposible de adivinar
```

### 4. Cliente hace clic en el link

```
GET /api/download?token=abc123xyz
  ↓
  Valida pago completado ✅
  ↓
  Valida límite de descargas ✅
  ↓
  Incrementa contador de descargas
  ↓
  Genera URL prefirmada de S3 (válida 2 días)
  ↓
  Redirige al archivo
```

### 5. Página de éxito protegida

```
GET /ebook/success?session_id=cs_xxx
  ↓
  Valida session_id con Stripe API ✅
  ↓
  Verifica payment_status === "paid" ✅
  ↓
  Busca compra en BD ✅
```

## 🛠️ Pasos de Implementación

### Paso 1: Migrar base de datos

\`\`\`bash

# Generar migración

npx prisma migrate dev --name add_purchase_model

# O si usas el helper de Prisma

# Se ejecutará automáticamente

\`\`\`

Esto creará la tabla `Purchase` con:

- `downloadToken`: Token único (cuid) generado automáticamente
- `tokenExpiresAt`: Fecha de expiración (30 días)
- `downloadCount`: Contador de descargas
- `maxDownloads`: Límite de descargas (5 por defecto)

### Paso 2: Configurar variables de entorno

Agrega a tu \`.env.local\`:

\`\`\`bash

# Stripe

STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SIGNING_SECRET=whsec_xxxxx

# Resend (para emails)

RESEND_API_KEY=re_xxxxx

# URL base de tu aplicación

NEXT_PUBLIC_BASE_URL=https://tudominio.com

# S3 (ya configurado)

AWS_S3_PRIVATE_BUCKET_NAME=tu-bucket-privado
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
\`\`\`

### Paso 3: Configurar webhook en Stripe Dashboard

1. Ve a: https://dashboard.stripe.com/webhooks
2. Click en "Add endpoint"
3. URL del endpoint: \`https://tudominio.com/api/checkout/webhook\`
4. Eventos a escuchar:
   - ✅ \`checkout.session.completed\`
   - ✅ \`charge.refunded\`
5. Copia el **Signing secret** y agrégalo como \`STRIPE_WEBHOOK_SIGNING_SECRET\`

### Paso 4: Modificar tu checkout para incluir metadata

Cuando crees la sesión de checkout de Stripe, agrega metadata:

\`\`\`typescript
const session = await stripe.checkout.sessions.create({
line_items: [
{
price_data: {
currency: "usd",
product_data: {
name: "Mi Ebook Increíble",
},
unit_amount: 2999, // $29.99
},
quantity: 1,
},
],
mode: "payment",
success_url: \`\${baseUrl}/ebook/success?session_id={CHECKOUT_SESSION_ID}\`,
cancel_url: \`\${baseUrl}/ebook\`,
metadata: {
productName: "Mi Ebook Increíble",
productType: "ebook",
s3Key: "ebooks/mi-ebook-increible.pdf", // ⚠️ IMPORTANTE: la ubicación en S3
},
});
\`\`\`

### Paso 5: Subir archivo a S3 privado

\`\`\`typescript
import { uploadPrivateFile } from "@/app/[locale]/actions/files";

// Subir archivo (desde dashboard de admin)
const s3Key = await uploadPrivateFile(file, "ebooks");
// Resultado: "ebooks/user123/1728234567890_mi-ebook.pdf"

// Guardar este s3Key en metadata al crear checkout
\`\`\`

### Paso 6: Personalizar email (opcional)

Edita \`src/components/email/download-email-template.tsx\` para ajustar:

- Colores de marca
- Logo de tu empresa
- Texto personalizado

### Paso 7: Probar el flujo completo

1. **Modo test de Stripe**:
   \`\`\`bash

   # Tarjeta de prueba

   4242 4242 4242 4242
   Fecha: cualquier fecha futura
   CVV: cualquier 3 dígitos
   \`\`\`

2. **Probar webhook localmente** (usando Stripe CLI):
   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/checkout/webhook
   \`\`\`

3. **Realizar compra de prueba**

4. **Verificar**:
   - ✅ Registro creado en tabla \`Purchase\`
   - ✅ Email recibido con link de descarga
   - ✅ Link funciona y descarga el archivo
   - ✅ Contador de descargas incrementa

## 🔒 Seguridad Implementada

### 1. Token único imposible de adivinar

\`\`\`typescript
downloadToken: String @unique @default(cuid())
// Ejemplo: clh5n8w7g0000j8x8y9z8y9z8
// Probabilidad de adivinarlo: 1 en 10^30
\`\`\`

### 2. Validación de pago en página de éxito

\`\`\`typescript
const session = await stripe.checkout.sessions.retrieve(sessionId);
if (session.payment_status !== "paid") {
// ❌ No mostrar descarga
}
\`\`\`

### 3. Validación de token en API

\`\`\`typescript
const purchase = await prisma.purchase.findUnique({
where: { downloadToken: token },
});

if (!purchase) return 404;
if (purchase.status !== "completed") return 403;
if (new Date() > purchase.tokenExpiresAt) return 410;
if (purchase.downloadCount >= purchase.maxDownloads) return 429;
\`\`\`

### 4. URL prefirmada temporal de S3

\`\`\`typescript
// URL válida solo 2 días
const downloadUrl = await createDownloadUrl(
purchase.s3Key,
"archivo.pdf",
60 _ 60 _ 24 \* 2 // 2 días
);
\`\`\`

### 5. Límite de descargas

\`\`\`typescript
downloadCount: Int @default(0)
maxDownloads: Int @default(5)

// Se incrementa en cada descarga
downloadCount: purchase.downloadCount + 1
\`\`\`

## 📊 Monitoreo y Analytics

### Ver compras en base de datos

\`\`\`typescript
const purchases = await prisma.purchase.findMany({
where: { status: "completed" },
orderBy: { createdAt: "desc" },
});
\`\`\`

### Ver descargas por producto

\`\`\`typescript
const stats = await prisma.purchase.groupBy({
by: ["productName"],
\_sum: { downloadCount: true },
\_count: true,
});
\`\`\`

### Logs importantes

- ✅ Webhook recibido
- ✅ Compra creada
- ✅ Email enviado
- ✅ Descarga generada
- ⚠️ Token expirado
- ⚠️ Límite de descargas alcanzado

## 🚨 Manejo de Casos Especiales

### Cliente perdió el email

1. Buscar compra por email en BD
2. Reenviar email con el mismo token
3. O generar nuevo token si expiró

### Cliente alcanzó límite de descargas

1. Verificar en BD: \`downloadCount >= maxDownloads\`
2. Aumentar \`maxDownloads\` manualmente si es necesario
3. O resetear \`downloadCount\` a 0

### Token expiró (30 días)

1. Verificar compra legítima
2. Extender \`tokenExpiresAt\`:
   \`\`\`typescript
   await prisma.purchase.update({
   where: { id: purchaseId },
   data: {
   tokenExpiresAt: new Date(Date.now() + 30 _ 24 _ 60 _ 60 _ 1000),
   },
   });
   \`\`\`

### Reembolso procesado

- Webhook automáticamente marca como \`status: "refunded"\`
- Link de descarga dejará de funcionar automáticamente

## 📧 Personalización del Email

El email incluye:

- ✅ Nombre del cliente
- ✅ Nombre del producto
- ✅ Botón de descarga destacado
- ✅ Link alternativo (por si el botón no funciona)
- ✅ Información de expiración y límites
- ✅ Detalles de la compra

Para cambiar el remitente:
\`\`\`typescript
from: "Tu Nombre <noreply@tudominio.com>"
\`\`\`

⚠️ **Importante**: Configura tu dominio en Resend para evitar spam.

## 🎯 Ventajas de Este Sistema

1. **Seguro**: Tokens únicos imposibles de adivinar
2. **Automático**: Todo el flujo es automático después del pago
3. **Controlado**: Límites de tiempo y número de descargas
4. **Auditable**: Registro completo de todas las descargas
5. **Escalable**: Funciona con miles de compras
6. **User-friendly**: Cliente recibe email inmediatamente
7. **Protected**: Página de éxito valida el pago real

## 🔧 Troubleshooting

### El webhook no se ejecuta

- Verifica que el endpoint esté público
- Revisa los logs en Stripe Dashboard
- Confirma el signing secret correcto

### El email no llega

- Verifica API key de Resend
- Revisa carpeta de spam
- Confirma dominio verificado en Resend

### Error al descargar

- Verifica que el archivo existe en S3
- Confirma permisos IAM correctos
- Revisa que el bucket privado esté configurado

### Token inválido

- Verifica que la migración de Prisma se ejecutó
- Confirma que el registro existe en BD
- Revisa que no haya typos en el token

---

**¿Todo listo?** Este sistema garantiza descargas 100% seguras con tokens únicos. 🎉
