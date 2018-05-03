# AWS CLOUDFORMATION UTILS

### NPM module to create/update cloudformation stacks

## Installation

```
npm install -g
```

## Usage

```
Usage: aws-cfm-utils [options]

Help: aws-cfm-utils --help //run this will provide examples
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
    --version                          Show version number               [boolean]

	Examples:
	aws-cfm-utils --stack-name stackname --template-body cfmtemplate --stack-policy-body stackpolicy --region eu-west-1 --enable-termination-protection true

## Requirements and Dependencies

1. NODE version >= 8.10

## Dependencies

1. aws-sdk
2. fs
3. util
4. yargs

## Disclaimer
_The SOFTWARE PACKAGE provided in this page is provided "as is", without any guarantee made as to its suitability or fitness for any particular use. It may contain bugs, so use of this tool is at your own risk. We take no responsibility for any damage of any sort that may unintentionally be caused through its use._

## Contacts

If you have any questions, drop an email to marcincuber@hotmail.com and leave stars! :)
