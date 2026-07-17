# Ashley Leon AWS infrastructure

This CDK project defines the storage and image-delivery infrastructure used by
the application. `InfraStack` provisions public and private S3 storage, a
CloudFront distribution, and scoped IAM credentials for uploads and downloads.
It can also reference an existing public images bucket through
`AWS_S3_BUCKET_NAME` instead of creating a new one.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
