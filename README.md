# cloudwatch snapshot graph to slack

## Configure

```
$ cp .env.sample .env
$ vi .env
```

## Set AWS Credential

```
$ export AWS_ACCESS_KEY_ID=0123456789
$ export AWS_SECRET_ACCESS_KEY=abcdefghijklmn
$ export AWS_DEFAULT_REGION=ap-northeast-1
```

## Usage

```
$ run deps # need nodejs 8.10
$ run package
$ run deploy
```
