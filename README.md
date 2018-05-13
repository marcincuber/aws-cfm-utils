[![Coverage Status](https://codecov.io/gh/marcincuber/aws-cfm-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/marcincuber/aws-cfm-utils)
[![Build Status](https://travis-ci.org/marcincuber/aws-cfm-utils.svg?branch=master)](https://travis-ci.org/marcincuber/aws-cfm-utils)
[![Known Vulnerabilities](https://snyk.io/test/github/marcincuber/aws-cfm-utils/badge.svg?targetFile=package.json)](https://snyk.io/test/github/marcincuber/aws-cfm-utils?targetFile=package.json)
[![npm version](https://badge.fury.io/js/aws-cfm-utils.svg)](https://badge.fury.io/js/aws-cfm-utils)
[![dependencies Status](https://david-dm.org/marcincuber/aws-cfm-utils/status.svg)](https://david-dm.org/marcincuber/aws-cfm-utils)
[![devDependencies Status](https://david-dm.org/marcincuber/aws-cfm-utils/dev-status.svg)](https://david-dm.org/marcincuber/aws-cfm-utils?type=dev)
[![npm weekly](https://img.shields.io/npm/dw/aws-cfm-utils.svg)](https://www.npmjs.com/~marcincuber)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fmarcincuber%2Faws-cfm-utils.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fmarcincuber%2Faws-cfm-utils?ref=badge_shield)


# AWS CLOUDFORMATION UTILS

### NPM module to create/update cloudformation stacks

## Installation

```
npm install -g aws-cfm-utils
```

## Usage

```
Usage: aws-cfm-utils [options]

Help: aws-cfm-utils --help

Version: aws-cfm-utils --version
```

    Options:
    --stack-name                                               [string] [required]
    --template-body                    CFM template file name             [string]
    --stack-policy-body                Stack policy file name             [string]
    --accesskeyid                      AWS access key                     [string]
    --secretkey                        AWS secret key                     [string]
    -h, --help                         Show help                         [boolean]
    --parameters                       CFM Parameters                      [array]
    --tags                             CFM Tags                            [array]
    --region                                       [string] [default: "eu-west-1"]
    --capabilities     [array] [choices: "CAPABILITY_NAMED_IAM", "CAPABILITY_IAM"]
    --profile                                                             [string]
    --role-arn                                                            [string]
    --resource-types                                                       [array]
    --disable-rollback                                                   [boolean]
    --template-url                                                        [string]
    --stack-policy-url                                                    [string]
    --notification-arns                                                    [array]
    --timeout-in-minutes                                                  [number]
    --on-failure            [string] [choices: "DO_NOTHING", "ROLLBACK", "DELETE"]
    --use-previous-template                                              [boolean]
    --stack-policy-during-update-body                                     [string]
    --stack-policy-during-update-url                                      [string]
    --wait                                                               [boolean]
    --enable-termination-protection                                      [boolean]
    --stack-events                                                       [boolean]
    -v, --version                      Show version number               [boolean]

### Examples:

```
1. aws-cfm-utils --stack-name stackname --template-body cfmtemplate --stack-policy-body stackpolicy --region eu-west-1 --enable-termination-protection true

2. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --enable-termination-protection true --region eu-west-1 --parameters test/fixtures/parameters.json --tags Key=TestTag,Value=TestTagValue Key=TestTag2,Value=TestTagValue2 Key=TestTag3,Value=TestTagValue4
    
3. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --enable-termination-protection true --region eu-west-1 --parameters test/fixtures/parameters.json --tags test/fixtures/tags.json
    
4. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --enable-termination-protection --region eu-west-1 --parameters ParameterKey=TestName,ParameterValue=TestKey ParameterKey=TestName2,ParameterValue=TestKey2

// More complicated ParameterValues in the following two examples, ensure to escape double quotes
5. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --enable-termination-protection --parameters ParameterKey=TestName,ParameterValue=\"subnet1,subnet2,subnet3\" ParameterKey=TestName2,ParameterValue=TestKey2

6. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --no-enable-termination-protection --parameters ParameterKey=vpc,ParameterValue=\"vpcid=12345,vpceid=12345\" ParameterKey=TestName2,ParameterValue=TestKey2

// More complicated TagValue in the following two examples, ensure to escape double quotes
7. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --enable-termination-protection --parameters ParameterKey=TestName,ParameterValue=\"subnet1,subnet2,subnet3\" ParameterKey=TestName2,ParameterValue=TestKey2 --tags Key=TestTag,Value=TestTagValue Key=s3buckets,Value=\"s3://bucket_name1/....,s3://bucket_name2/....\"

8. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --no-enable-termination-protection --parameters ParameterKey=vpc,ParameterValue=\"vpcid=12345,vpceid=12345\" ParameterKey=TestName2,ParameterValue=TestKey2 --tags Key=s3bucket,Value=\"S3link=s3://bucket_name/....,S3name=bucket_name\"

// Using AccessKeyID and SecretKey credentials
9. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --no-enable-termination-protection --parameters test/fixtures/parameters.json --tags test/fixtures/tags.json  --accesskeyid A12389sasfas123A --secretkey /+-sadasd213123,123asdPOhrP9+4xW8z7v3h --stack-events

// Using profile from your aws config
10. aws-cfm-utils --stack-name mynewstack --template-body test/fixtures/template.json --stack-policy-body test/fixtures/stackpolicy.json --no-enable-termination-protection --parameters test/fixtures/parameters.json --tags test/fixtures/tags.json  --profile yourprofilname --stack-events
```

In general, please use `/"your_values/"` for `--parameters` or `--tags` to ensure your values include all the special characters.

### Global parameters ([AWS CLI Docs](http://docs.aws.amazon.com/cli/latest/topic/config-vars.html#general-options)):

```
--accesskeyid 
--secretkey 
--profile 
--region // defaults to Ireland region eu-west-1
```

Note: you can either specify `profile` value or `accesskeyid` && `secretkey`. Otherwise error is returned. More about credential in `Credential settings` section.

### Used during creation of the stack, otherwise ignored ([create-stack](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-stack.html)):

```
--enable-termination-protection | --no-enable-termination-protection
--disable-rollback | --no-disable-rollback
--timeout-in-minutes
--on-failure
```

### Used during update of the stack, otherwise ignored ([update-stack](http://docs.aws.amazon.com/cli/latest/reference/cloudformation/update-stack.html)):

```
--use-previous-template | --no-use-previous-template
--stack-policy-during-update-body
--stack-policy-during-update-url
```

### Addional Custom options for update-stack and create-stack 

In order to see all the `CloudFormation Stack Events` happening during update/create process. Use the following option;

```
--stack-events // if not specified only stack status is shown
```

Example log output when `--stack-events` is specified. It is very similar to what we see in the AWS Console:

```
Stack Events for stack: mynewstack
-----------------------------------------------------------------------------------------------------------------------------
TimeStamp                                ResourceStatus      Type                        LogicalID             Reason
---------------------------------------  ------------------  --------------------------  --------------------  --------------
Sun May 13 2018 03:51:17 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::NetworkAcl        PrivateNetworkAcl
Sun May 13 2018 03:51:17 GMT+0100 (BST)  UPDATE_IN_PROGRESS  AWS::EC2::NetworkAcl        PrivateNetworkAcl
Sun May 13 2018 03:51:16 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::Subnet            PublicSubnet1
Sun May 13 2018 03:51:16 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::Subnet            PublicSubnet2
Sun May 13 2018 03:51:16 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::Subnet            PrivateSubnet2
Sun May 13 2018 03:51:15 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::RouteTable        PrivateRouteTable1
Sun May 13 2018 03:51:15 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::Subnet            PrivateSubnet1
Sun May 13 2018 03:51:15 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::RouteTable        PublicRouteTable
Sun May 13 2018 03:51:15 GMT+0100 (BST)  UPDATE_COMPLETE     AWS::EC2::RouteTable        PrivateRouteTable2
...
```

## Credential settings, General order of execution

The AWS CLI looks for credentials and configuration settings in the following order:
1. Command line options – region, output format and profile can be specified as command options to override default settings.
2. Environment variables – AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN.
3. The AWS credentials file – located at ~/.aws/credentials on Linux, macOS, or Unix, or at C:\Users\USERNAME \.aws\credentials on Windows. This file can contain multiple named profiles in addition to a default profile.
4. The CLI configuration file – typically located at ~/.aws/config on Linux, macOS, or Unix, or at C:\Users\USERNAME \.aws\config on Windows. This file can contain a default profile, named profiles, and CLI specific configuration parameters for each.
5. Container credentials – provided by Amazon Elastic Container Service on container instances when you assign a role to your task.
6. Instance profile credentials – these credentials can be used on EC2 instances with an assigned instance role, and are delivered through the Amazon EC2 metadata service.

## Unit Tests

```
npm run test

```

## Eslint

```
npm run eslint
```

## Coverage

```
npm run coverage
```

## Requirements and Dependencies

1. NODE version >= 8.10

## Dependencies

1. aws-sdk
2. fs
3. util
4. yargs
5. path
6. console.table

## Contacts

If you have any questions, drop me an email marcincuber@hotmail.com or open an issue and leave stars! :)
