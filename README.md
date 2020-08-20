# cloudwatch snapshot graph to slack

## Set AWS Credential

```
$ export AWS_ACCESS_KEY_ID=0123456789
$ export AWS_SECRET_ACCESS_KEY=abcdefghijklmn
$ export AWS_DEFAULT_REGION=ap-northeast-1
```

## Create S3 Bucket for SAM Packaging

```
$ aws s3 mb s3://${bucket-for-sam-packaging}
```

## Configure Environment

```
$ cp .env.sample .env
$ vi .env
```

## Deploy

```
$ make deps # need nodejs 12.x
$ make package
$ make deploy
```
