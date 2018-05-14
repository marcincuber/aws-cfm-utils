#!/usr/bin/env bash
set -e

echo "Running publish script"

echo $(printf "TRAVIS_BRANCH %s" ${TRAVIS_BRANCH})
echo $(printf "TRAVIS_PULL_REQUEST %s" ${TRAVIS_PULL_REQUEST})

# if [[ ${TRAVIS_BRANCH} != 'master' ]]
# then
#   echo "Not on master"
#   exit 0
# fi

# if [[ ${TRAVIS_PULL_REQUEST} != 'false' ]]
# then
#   echo "We don't publish for PRs"
#   exit 0
# fi

# set up git
git config user.name "Publish Travis"
git config user.email "marcincuber@hotmail.com"

git remote set-url origin https://${GH_TOKEN}@github.com/marcincuber/aws-cfm-utils.git > /dev/null 2>&1

TAGS=$(git tag -l --points-at HEAD)
echo $(printf "Existing tags %s" ${TAGS})

# we don't want to recursively publish
# if [[ ${TAGS} ]]
# then
#   echo "This is the published c
#   ommit"
#   exit 0
# fi

git checkout master

VERSION_MASTER_BRANCH=$(node -p -e "require('./package.json').version")
echo $(printf "Package version on master branch %s" ${VERSION_MASTER})

TIP_COMMIT=$(git rev-parse HEAD)
echo $(printf "Travis commit: %s, Head commit: %s" ${TRAVIS_COMMIT} ${TIP_COMMIT})

make sure we only publish if we are at the head of master
if [[ ${TIP_COMMIT} != ${TRAVIS_COMMIT} ]]
then
  echo "Not on the tip of master!"
  exit 0
fi

# # set npm credentials
# echo "Setting up npm"
# echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

# # bump versions, create change logs, create tags, publish to npm
# PR_MSG=$(git log --pretty=format:"%h" -1)
# MESSAGE=$(printf "chore: Publish %s" $PR_MSG)
# echo $MESSAGE
# lerna publish --conventional-commits --yes --concurrency=1 --exact -m "$MESSAGE"

# # push above changes to git
# echo "Pushing to master"
# git push origin master --tags --quiet > /dev/null 2>&1

