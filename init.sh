#!/bin/bash

# ts-codegen-framework initialization script
# This script helps you set up your custom codegen tool

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=à  Welcome to ts-codegen-framework setup!${NC}"
echo -e "This script will help you create your custom codegen tool.\n"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}L Error: This doesn't appear to be a ts-codegen-framework directory${NC}"
    echo "Make sure you're in the root of your cloned framework directory."
    exit 1
fi

# Check if already initialized (package name changed)
if ! grep -q "@angelxmoreno/ts-codegen-framework" package.json; then
    echo -e "${YELLOW}   This project appears to already be initialized.${NC}"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

echo -e "${BLUE}=Ý Let's collect some information about your tool:${NC}"

# Collect user information
read -p "Tool name (e.g., my-api-codegen): " TOOL_NAME
while [[ -z "$TOOL_NAME" ]]; do
    echo -e "${RED}Tool name cannot be empty${NC}"
    read -p "Tool name (e.g., my-api-codegen): " TOOL_NAME
done

read -p "Your name: " AUTHOR_NAME
while [[ -z "$AUTHOR_NAME" ]]; do
    echo -e "${RED}Author name cannot be empty${NC}"
    read -p "Your name: " AUTHOR_NAME
done

read -p "Your email: " AUTHOR_EMAIL
while [[ -z "$AUTHOR_EMAIL" ]]; do
    echo -e "${RED}Email cannot be empty${NC}"
    read -p "Your email: " AUTHOR_EMAIL
done

read -p "GitHub username: " GITHUB_USER
while [[ -z "$GITHUB_USER" ]]; do
    echo -e "${RED}GitHub username cannot be empty${NC}"
    read -p "GitHub username: " GITHUB_USER
done

read -p "Tool description: " DESCRIPTION
if [[ -z "$DESCRIPTION" ]]; then
    DESCRIPTION="A custom code generation tool built with ts-codegen-framework"
fi

echo -e "\n${BLUE}=æ Updating package.json...${NC}"

# Create backup
cp package.json package.json.bak

# Update package.json using sed (cross-platform)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|@angelxmoreno/ts-codegen-framework|$TOOL_NAME|g" package.json
    sed -i '' "s|Angel Moreno <angelxmoreno@gmail.com>|$AUTHOR_NAME <$AUTHOR_EMAIL>|g" package.json
    sed -i '' "s|angelxmoreno/ts-codegen-framework|$GITHUB_USER/$TOOL_NAME|g" package.json
    sed -i '' "s|A TypeScript framework for zero-build CLI codegen with templates and config|$DESCRIPTION|g" package.json
    sed -i '' '/"publishConfig"/,+2d' package.json  # Remove GitHub Packages config
    sed -i '' '/"files"/,/],/d' package.json  # Remove files array (user can customize)
else
    # Linux
    sed -i "s|@angelxmoreno/ts-codegen-framework|$TOOL_NAME|g" package.json
    sed -i "s|Angel Moreno <angelxmoreno@gmail.com>|$AUTHOR_NAME <$AUTHOR_EMAIL>|g" package.json
    sed -i "s|angelxmoreno/ts-codegen-framework|$GITHUB_USER/$TOOL_NAME|g" package.json
    sed -i "s|A TypeScript framework for zero-build CLI codegen with templates and config|$DESCRIPTION|g" package.json
    sed -i '/"publishConfig"/,+2d' package.json  # Remove GitHub Packages config
    sed -i '/"files"/,/],/d' package.json  # Remove files array (user can customize)
fi

echo -e "${GREEN} Package.json updated${NC}"

# Publishing setup
echo -e "\n${BLUE}=€ Publishing setup:${NC}"
echo "Where would you like to publish your tool?"
echo "1) npm registry (recommended)"
echo "2) GitHub Packages"  
echo "3) Skip publishing setup"

read -p "Choose option (1-3): " PUBLISH_CHOICE

case $PUBLISH_CHOICE in
    1)
        echo -e "${BLUE}Setting up npm publishing...${NC}"
        if [ -f ".npmrc.template" ]; then
            cp .npmrc.template .npmrc
            # Set npm registry as default
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' 's|# registry=https://registry.npmjs.org/|registry=https://registry.npmjs.org/|g' .npmrc
                sed -i '' 's|@YOUR_USERNAME:registry=https://npm.pkg.github.com|# @YOUR_USERNAME:registry=https://npm.pkg.github.com|g' .npmrc
            else
                sed -i 's|# registry=https://registry.npmjs.org/|registry=https://registry.npmjs.org/|g' .npmrc
                sed -i 's|@YOUR_USERNAME:registry=https://npm.pkg.github.com|# @YOUR_USERNAME:registry=https://npm.pkg.github.com|g' .npmrc
            fi
        fi
        if [ -f ".github/workflows/publish-to-npm.yml.template" ]; then
            cp .github/workflows/publish-to-npm.yml.template .github/workflows/publish-to-npm.yml
        fi
        echo -e "${GREEN} npm publishing configured${NC}"
        echo -e "${YELLOW}=Ý Don't forget to add NPM_TOKEN secret to your GitHub repository!${NC}"
        ;;
    2)
        echo -e "${BLUE}Setting up GitHub Packages publishing...${NC}"
        if [ -f ".npmrc.template" ]; then
            cp .npmrc.template .npmrc
            # Set GitHub Packages registry
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' "s|@YOUR_USERNAME|@$GITHUB_USER|g" .npmrc
                sed -i '' 's|# @YOUR_USERNAME:registry=https://npm.pkg.github.com|@YOUR_USERNAME:registry=https://npm.pkg.github.com|g' .npmrc
                sed -i '' 's|registry=https://registry.npmjs.org/|# registry=https://registry.npmjs.org/|g' .npmrc
            else
                sed -i "s|@YOUR_USERNAME|@$GITHUB_USER|g" .npmrc
                sed -i 's|# @YOUR_USERNAME:registry=https://npm.pkg.github.com|@YOUR_USERNAME:registry=https://npm.pkg.github.com|g' .npmrc
                sed -i 's|registry=https://registry.npmjs.org/|# registry=https://registry.npmjs.org/|g' .npmrc
            fi
        fi
        # Update package.json for scoped name
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s|\"name\": \"$TOOL_NAME\"|\"name\": \"@$GITHUB_USER/$TOOL_NAME\"|g" package.json
        else
            sed -i "s|\"name\": \"$TOOL_NAME\"|\"name\": \"@$GITHUB_USER/$TOOL_NAME\"|g" package.json
        fi
        echo -e "${GREEN} GitHub Packages publishing configured${NC}"
        ;;
    3)
        echo -e "${YELLOW}í  Skipping publishing setup${NC}"
        ;;
    *)
        echo -e "${YELLOW}í  Invalid choice, skipping publishing setup${NC}"
        ;;
esac

# Clean up framework-specific files
echo -e "\n${BLUE}>ù Cleaning up framework-specific files...${NC}"

# Remove framework publishing workflow
if [ -f ".github/workflows/publish.yml" ]; then
    rm -f .github/workflows/publish.yml
    echo "  Removed framework publishing workflow"
fi

# Remove template files if they were copied
if [ -f ".npmrc" ]; then
    rm -f .npmrc.template
    echo "  Removed .npmrc.template"
fi

if [ -f ".github/workflows/publish-to-npm.yml" ]; then
    rm -f .github/workflows/publish-to-npm.yml.template
    echo "  Removed publish-to-npm.yml.template"
fi

# Remove backup
rm -f package.json.bak

echo -e "${GREEN} Cleanup complete${NC}"

# Git repository setup
echo -e "\n${BLUE}=Ë Git repository setup:${NC}"
read -p "Initialize a new git repository? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}= Initializing new git repository...${NC}"
    rm -rf .git
    git init
    git add .
    git commit -m "feat: initialize $TOOL_NAME from ts-codegen-framework

Created custom codegen tool with:
- Tool name: $TOOL_NAME
- Author: $AUTHOR_NAME
- Publishing: $([ "$PUBLISH_CHOICE" = "1" ] && echo "npm" || [ "$PUBLISH_CHOICE" = "2" ] && echo "GitHub Packages" || echo "none")

> Generated with [ts-codegen-framework](https://github.com/angelxmoreno/ts-codegen-framework)"
    echo -e "${GREEN} New git repository initialized${NC}"
    echo -e "${YELLOW}=Ý Don't forget to set up your remote origin!${NC}"
else
    echo -e "${YELLOW}í  Keeping existing git history${NC}"
fi

# Install dependencies and test
echo -e "\n${BLUE}=æ Installing dependencies...${NC}"
if command -v bun >/dev/null 2>&1; then
    bun install
    echo -e "${GREEN} Dependencies installed with bun${NC}"
    
    echo -e "\n${BLUE}>ê Running tests to verify setup...${NC}"
    if bun test; then
        echo -e "${GREEN} Tests passed!${NC}"
    else
        echo -e "${YELLOW}   Some tests failed, but setup is complete${NC}"
    fi
else
    echo -e "${YELLOW}   Bun not found, skipping dependency installation${NC}"
    echo -e "   Please run 'bun install' or 'npm install' manually"
fi

# Final instructions
echo -e "\n${GREEN}<‰ Setup complete!${NC}"
echo -e "\n${BLUE}Your custom codegen tool '$TOOL_NAME' is ready!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Customize your configuration schema in 'src/config/config.schema.ts'"
echo "2. Update your templates in 'src/config/templates/'"
echo "3. Modify the template context in 'src/config/templateContext.ts'"
echo "4. Test your tool: './bin/codegen generate -c sample-app/codegen.config.ts -v'"
echo ""
echo -e "${BLUE}Happy coding! =€${NC}"