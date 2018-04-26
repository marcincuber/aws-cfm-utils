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
	-n, --name         AWS stack name                          [string] [required]
 	-t, --template     CFM template file name                  [string] [required]
  	-p, --stackpolicy  Stack policy file name                  [string] [required]
  	-k, --accesskeyid  Your AWS access key                                [string]
  	-s, --secretkey    Your AWS secret key                                [string]
  	-h, --help         Show help                                         [boolean]
  	-v, --version      Show version number                               [boolean]

	Examples:
	aws-cfm-utils -n stackname -t cfmtemplate -p stackpolicy     
  	aws-cfm-utils --name stackname --template cfmtemplate --stackpolicy stackpolicy

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
