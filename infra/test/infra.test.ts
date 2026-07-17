import * as cdk from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { InfraStack } from "../lib/infra-stack";

describe("InfraStack", () => {
  const app = new cdk.App();
  const stack = new InfraStack(app, "MyTestStack", {
    existingImagesBucketName: "",
  });
  const template = Template.fromStack(stack);

  test("creates the public and private storage buckets", () => {
    template.resourceCountIs("AWS::S3::Bucket", 2);
    template.hasResourceProperties("AWS::S3::Bucket", {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      VersioningConfiguration: {
        Status: "Enabled",
      },
    });
  });

  test("creates the image delivery distribution", () => {
    template.resourceCountIs("AWS::CloudFront::Distribution", 1);
    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: Match.objectLike({
        Comment: "Distribución para imágenes de la app",
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: "redirect-to-https",
        }),
        Enabled: true,
        PriceClass: "PriceClass_100",
      }),
    });
  });

  test("creates scoped uploader credentials", () => {
    template.hasResourceProperties("AWS::IAM::User", {
      UserName: "s3-image-uploader",
    });
    template.resourceCountIs("AWS::IAM::AccessKey", 1);
    template.hasResourceProperties("AWS::IAM::Policy", {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: [
              "s3:PutObject",
              "s3:GetObject",
              "s3:PutObjectAcl",
              "s3:GetObjectAcl",
              "s3:ListBucket",
              "s3:DeleteObject",
            ],
            Effect: "Allow",
          }),
        ]),
      }),
    });
  });
});
