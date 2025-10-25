# 📦 Guía: Despliegue de Bucket Privado S3 (Sin Afectar Producción)

## ✅ Lo que SE hizo

1. **Modificado `infra-stack.ts`**:
   - Usa `Bucket.fromBucketName()` para IMPORTAR el bucket existente (NO lo recrea)
   - Agrega nuevo bucket privado `PrivateFilesBucket` completamente separado
   - Actualiza permisos IAM para incluir ambos buckets

2. **Creado `src/app/[locale]/actions/files/index.ts`**:
   - Helper para subir archivos privados
   - Generador de URLs prefirmadas con 2 días de expiración
   - Validación de permisos de usuario

## 📝 Pasos para Despliegue

### 1. Configurar variable de entorno ANTES del deploy

Crea o actualiza `infra/.env` con el nombre de tu bucket EXISTENTE:

\`\`\`bash
cd infra
echo "AWS_S3_BUCKET_NAME=tu-bucket-existente-en-produccion" > .env
\`\`\`

### 2. Instalar dependencias de CDK (si no lo has hecho)

\`\`\`bash
cd infra
npm install
\`\`\`

### 3. Verificar cambios antes de desplegar

\`\`\`bash
npx cdk diff
\`\`\`

**Deberías ver**:

- ✅ Nuevo recurso: `PrivateFilesBucket`
- ✅ Actualización: Política IAM del usuario
- ✅ Nuevos outputs: `PrivateBucketName`, `PrivateBucketArn`
- ❌ **NO debería aparecer**: Cambios en `ImagesBucket` (solo se importa)

### 4. Desplegar infraestructura

\`\`\`bash
npx cdk deploy
\`\`\`

### 5. Copiar outputs y configurar variables de entorno

Después del deploy, verás algo como:

\`\`\`
Outputs:
InfraStack.PrivateBucketName = infra-privatefilesbucket-abc123xyz
InfraStack.PrivateBucketArn = arn:aws:s3:::infra-privatefilesbucket-abc123xyz
\`\`\`

Agrega a tu `.env.local` en la raíz del proyecto:

\`\`\`bash

# Bucket privado para archivos descargables

AWS_S3_PRIVATE_BUCKET_NAME=infra-privatefilesbucket-abc123xyz
\`\`\`

## 🔧 Ejemplo de Uso

### 1. Subir archivo privado (ebook, PDF, etc.)

\`\`\`typescript
import { uploadPrivateFile } from "@/app/[locale]/actions/files";

// En tu server action o componente
const s3Key = await uploadPrivateFile(file, "ebooks");

// Guardar en BD
await prisma.ebook.create({
data: {
title: "Mi Ebook",
s3Key: s3Key, // ✅ Guarda la key, NO la URL
originalName: file.name,
userId: userId,
},
});
\`\`\`

### 2. Generar URL de descarga temporal

\`\`\`typescript
import { createDownloadUrl } from "@/app/[locale]/actions/files";

// Al descargar
const ebook = await prisma.ebook.findUnique({ where: { id } });
const downloadUrl = await createDownloadUrl(
ebook.s3Key,
\`\${ebook.title}.pdf\`
);

// Redirigir o devolver URL al frontend
return { url: downloadUrl };
\`\`\`

### 3. Desde el frontend

\`\`\`typescript
// Llamada a la API
const response = await fetch(\`/api/download?fileId=\${ebookId}\`);
const { url } = await response.json();

// Descargar archivo
window.location.href = url;
// O abrir en nueva pestaña
window.open(url, '\_blank');
\`\`\`

## 🔐 Seguridad

### Importante:

- ✅ **El bucket privado NO es accesible públicamente**
- ✅ **URLs expiran automáticamente en 2 días**
- ✅ **Solo usuarios autenticados pueden generar URLs**
- ⚠️ **Valida permisos antes de generar URLs** (compras, suscripciones, etc.)

### Ejemplo de validación de compra:

\`\`\`typescript
const purchase = await prisma.purchase.findFirst({
where: {
userId: userId,
ebookId: ebookId,
status: "completed",
},
});

if (!purchase) {
throw new Error("Debes comprar este ebook primero");
}

// Ahora sí generar URL
const url = await createDownloadUrl(ebook.s3Key);
\`\`\`

## 📂 Estructura de Carpetas en S3

\`\`\`
private-bucket/
├── ebooks/
│ ├── user_abc123/
│ │ ├── 1728234567890_mi-ebook.pdf
│ │ └── 1728234567891_otro-ebook.pdf
│ └── user_xyz456/
│ └── 1728234567892_ebook.pdf
├── invoices/
│ └── user_abc123/
│ └── 1728234567893_factura.pdf
└── certificates/
└── user_abc123/
└── 1728234567894_certificado.pdf
\`\`\`

## ⚠️ Notas Importantes

1. **Límite de expiración**: AWS S3 permite máximo 7 días para URLs prefirmadas
2. **Costos**: Solo pagas por:
   - Almacenamiento de archivos
   - Transferencia de datos al descargar
   - Requests API (GET, PUT)
3. **NO uses CloudFront** para archivos privados (los bucket privados no lo necesitan)
4. **Guarda solo la `key` en BD**, genera URLs on-demand
5. **No compartas URLs prefirmadas públicamente** (son temporales pero válidas)

## 🧪 Testing

Prueba la funcionalidad:

\`\`\`bash

# 1. Sube un archivo de prueba usando tu dashboard

# 2. Verifica que se guardó en S3:

aws s3 ls s3://tu-private-bucket-name/ebooks/ --recursive

# 3. Genera URL de descarga desde tu app

# 4. Verifica que la URL expire después de 2 días

\`\`\`

## 🚨 Troubleshooting

### Error: "AWS_S3_PRIVATE_BUCKET_NAME no configurado"

- Asegúrate de agregar la variable en `.env.local`

### Error: "Access Denied"

- Verifica que las credenciales IAM tengan permisos sobre el bucket privado
- Revisa que el policy del usuario incluya `s3:GetObject` y `s3:PutObject`

### Error: "Signature has expired"

- La URL prefirmada expiró (2 días)
- Genera una nueva URL llamando a `createDownloadUrl()` nuevamente

## 📊 Monitoreo

Revisa métricas en AWS CloudWatch:

- Número de descargas
- Tamaño de transferencia
- Errores de acceso

\`\`\`bash

# Ver logs del bucket

aws s3api get-bucket-logging --bucket tu-private-bucket-name
\`\`\`

---

**¿Todo listo?** Despliega con confianza - tu bucket de producción NO será afectado ✅
