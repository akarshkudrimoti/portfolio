#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Create a temporary directory
echo "Creating a temporary directory..."
mkdir -p temp_deploy

# Copy the build output to the temporary directory
echo "Copying build output..."
cp -r out/* temp_deploy/

# Create a .nojekyll file to prevent GitHub Pages from processing the site with Jekyll
echo "Creating .nojekyll file..."
touch temp_deploy/.nojekyll

# Switch to the gh-pages branch or create it if it doesn't exist
echo "Switching to gh-pages branch..."
git checkout gh-pages || git checkout --orphan gh-pages

# Remove all files except the temporary directory
echo "Cleaning the gh-pages branch..."
git rm -rf .
git clean -fxd

# Copy the contents of the temporary directory to the current directory
echo "Copying files to gh-pages branch..."
cp -r temp_deploy/* .

# Add all files to git
echo "Adding files to git..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Deploy to GitHub Pages"

# Push the changes to the gh-pages branch
echo "Pushing to GitHub..."
git push origin gh-pages

# Switch back to the main branch
echo "Switching back to main branch..."
git checkout main

# Remove the temporary directory
echo "Cleaning up..."
rm -rf temp_deploy

echo "Deployment complete! Your site should be live at https://akarshkudrimoti.github.io/portfolio/" 