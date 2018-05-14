#!/usr/bin/env bash
set -e

echo "Running publish script"

echo $(printf "TRAVIS_BRANCH %s" ${TRAVIS_BRANCH})
echo $(printf "TRAVIS_PULL_REQUEST %s" ${TRAVIS_PULL_REQUEST})

if [[ ${TRAVIS_BRANCH} != 'master' ]]
then
  echo "Not on master branch!"
  exit 0
fi

if [[ ${TRAVIS_PULL_REQUEST} != 'false' ]]
then
  echo "We don't publish for PRs"
  exit 0
fi

# set up git
git config user.name "Publish Travis"
git config user.email "marcincuber@hotmail.com"

git remote set-url origin https://${GH_TOKEN}@github.com/marcincuber/aws-cfm-utils.git > /dev/null 2>&1

# update remote branches
git remote update -p

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
echo $(printf "Package version on master branch %s" ${PACKAGE_VERSION})

TAG_VERSION="v${PACKAGE_VERSION}"

TIP_COMMIT=$(git rev-parse origin/master)
echo $(printf "Travis commit: %s, Head commit: %s" ${TRAVIS_COMMIT} ${TIP_COMMIT})

#make sure we only publish if we are at the head of master
if [[ ${TIP_COMMIT} != ${TRAVIS_COMMIT} ]]
then
  echo "Not on the tip of master!"
  exit 0
fi

# Publish tag fails if the tag already exists
git tag ${TAG_VERSION}
git push origin master ${TAG_VERSION} --quiet > /dev/null 2>&1
# NOTE: id the tag already exists, the above will fail quietly and process will exit with code 0;

echo "New Github Tag has been published!"

# Set npm credentials
echo "Setting up npm"
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

NPM_VERSIONS=$(npm view aws-cfm-utils versions --json)
NPM_VERSION_STATUS=$(echo ${NPM_VERSIONS} | jq 'contains([ "'$PACKAGE_VERSION'" ])')

# Publish new version of NPM module
if [ "${NPM_VERSION_STATUS}" = true ] ; 
then
  echo "This version of NPM module is already published! Exiting."
  exit 0
else
  echo $(printf "We are publishing NPM with new version: %s" ${PACKAGE_VERSION})
  npm publish
fi

rm ~/.npmrc
