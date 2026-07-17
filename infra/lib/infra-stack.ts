import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";

export interface InfraStackProps extends cdk.StackProps {
  existingImagesBucketName?: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfraStackProps) {
    super(scope, id, props);

    // Importar el bucket existente de imágenes (NO lo recrea)
    const existingBucketName =
      props?.existingImagesBucketName ?? process.env.AWS_S3_BUCKET_NAME ?? "";
    const imagesBucket = existingBucketName
      ? s3.Bucket.fromBucketName(this, "ImagesBucket", existingBucketName)
      : new s3.Bucket(this, "ImagesBucket", {
          versioned: true,
          encryption: s3.BucketEncryption.S3_MANAGED,
          publicReadAccess: true,
          blockPublicAccess: new s3.BlockPublicAccess({
            blockPublicAcls: false,
            blockPublicPolicy: false,
            ignorePublicAcls: false,
            restrictPublicBuckets: false,
          }),
          cors: [
            {
              allowedHeaders: ["*"],
              allowedMethods: [
                s3.HttpMethods.GET,
                s3.HttpMethods.PUT,
                s3.HttpMethods.POST,
                s3.HttpMethods.DELETE,
              ],
              allowedOrigins: ["*"],
              maxAge: 3000,
            },
          ],
          removalPolicy: cdk.RemovalPolicy.RETAIN,
        });

    const oai = new cloudfront.OriginAccessIdentity(this, "ImagesOAI");

    // Agregamos CloudFront Distribution
    const distribution = new cloudfront.Distribution(
      this,
      "ImagesDistribution",
      {
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessIdentity(imagesBucket, {
            originAccessIdentity: oai,
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
          responseHeadersPolicy:
            cloudfront.ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // El más económico (solo ubicaciones en América del Norte y Europa)
        enableLogging: false, // Puedes activar logs si los necesitas
        comment: "Distribución para imágenes de la app",
      }
    );

    // ========================================
    // BUCKET PRIVADO PARA ARCHIVOS DESCARGABLES
    // ========================================
    const privateFilesBucket = new s3.Bucket(this, "PrivateFilesBucket", {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      publicReadAccess: false, // ❌ NO acceso público
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // ✅ Bloquear TODO acceso público
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ["*"], // Restringe esto a tu dominio en producción
          maxAge: 3000,
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Crear usuario IAM para manejar URLs prefirmadas
    const s3User = new iam.User(this, "S3ImageUploader", {
      userName: "s3-image-uploader",
    });

    // Política para permitir generar URLs prefirmadas (PUT), obtener objetos (GET),
    // y eliminar objetos (DELETE)
    const s3Policy = new iam.PolicyStatement({
      actions: [
        "s3:PutObject",
        "s3:GetObject",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl",
        "s3:ListBucket",
        "s3:DeleteObject",
      ],
      effect: iam.Effect.ALLOW,
      resources: [
        `${imagesBucket.bucketArn}/*`, // Acceso a objetos del bucket público
        imagesBucket.bucketArn, // Acceso al bucket (listar)
        `${privateFilesBucket.bucketArn}/*`, // ✅ Acceso a objetos del bucket privado
        privateFilesBucket.bucketArn, // ✅ Acceso al bucket privado (listar)
      ],
    });

    // Adjuntar la política al usuario
    s3User.addToPolicy(s3Policy);

    // Crear acceso programático (access key y secret)
    const accessKey = new iam.CfnAccessKey(this, "S3UploaderAccessKey", {
      userName: s3User.userName,
    });

    // Outputs para usar en la aplicación
    new cdk.CfnOutput(this, "BucketName", {
      value: imagesBucket.bucketName,
      description: "Nombre del bucket para imágenes",
    });

    //Output para CloudFront
    new cdk.CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
      description: "URL de CloudFront para las imágenes",
    });

    new cdk.CfnOutput(this, "AccessKeyId", {
      value: accessKey.ref,
      description: "Access Key ID para subir imágenes",
    });

    new cdk.CfnOutput(this, "SecretAccessKey", {
      value: accessKey.attrSecretAccessKey,
      description: "Secret Access Key para subir imágenes",
      exportName: "ImagesUploaderSecretKey",
    });

    new cdk.CfnOutput(this, "BucketURL", {
      value: `https://${imagesBucket.bucketName}.s3.amazonaws.com`,
      description: "URL base del bucket",
    });

    // ========================================
    // OUTPUTS DEL BUCKET PRIVADO
    // ========================================
    new cdk.CfnOutput(this, "PrivateBucketName", {
      value: privateFilesBucket.bucketName,
      description: "Nombre del bucket privado para archivos descargables",
    });

    new cdk.CfnOutput(this, "PrivateBucketArn", {
      value: privateFilesBucket.bucketArn,
      description: "ARN del bucket privado",
    });
  }
}
