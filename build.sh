#!/bin/bash

# Linux Bash script to build and update the gh-pages branch based on changes made in the master branch.
# Only the commit and push are left to be done manually.

git checkout master;
npm install;
grunt;
git checkout gh-pages;
cd gh-pages;
cp -R * ..;
git add --all .;
cd ..;
git add --all .;
#git commit -m 'update to latest build'
#git push