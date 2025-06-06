# Configuration (`config/`)

This directory contains **shared configurations** used across the monorepo.

## Purpose

Centralized location for configuration files that are shared between multiple projects or environments, helping maintain consistency and reducing duplication.

## Typical Contents

### CI/CD Configurations
- **`ci/`** - Shared CI/CD pipeline templates and scripts
- **`docker/`** - Common Docker configurations and base images
- **`deployment/`** - Deployment scripts and configuration templates

### Development Configurations
- **`vscode/`** - Shared VS Code settings and extensions
- **`ide/`** - IDE-specific configurations (IntelliJ, PHPStorm, etc.)
- **`git/`** - Git hooks and shared Git configurations

### Environment Configurations
- **`env/`** - Environment variable templates
- **`ssl/`** - SSL certificates for local development
- **`nginx/`** - Nginx configuration templates

### Build Configurations
- **`webpack/`** - Shared Webpack configurations
- **`babel/`** - Babel preset configurations
- **`rollup/`** - Rollup configuration templates

## Usage Examples

Configuration files in this directory can be referenced from projects:

```bash
# Reference shared Docker config
COPY ../../config/docker/nginx.conf /etc/nginx/

# Use shared environment template
cp config/env/.env.template apps/my-app/.env.local

# Include shared webpack config
const sharedConfig = require('../../config/webpack/base.config.js');
```

## Organization Principles

### By Technology
```
config/
├── docker/              # Docker-related configs
├── nginx/               # Web server configs
├── database/            # Database configs
└── monitoring/          # Observability configs
```

### By Environment
```
config/
├── development/         # Dev-specific configs
├── staging/             # Staging configs  
├── production/          # Production configs
└── testing/             # Test configs
```

### By Purpose
```
config/
├── ci-cd/               # Build and deployment
├── security/            # Security configurations
├── performance/         # Performance tuning
└── logging/             # Logging configurations
```

## Best Practices

- **Version Control**: All configurations should be versioned
- **Documentation**: Include README for complex configurations
- **Environment Variables**: Use environment variables for sensitive data
- **Validation**: Include configuration validation where possible
- **Templates**: Provide `.template` files for configurations containing secrets

## Security Considerations

- **Never commit secrets** - Use environment variables or secret management
- **Use .template files** for configurations that contain sensitive placeholders
- **Document security requirements** for each configuration
- **Regular audits** of configuration files for security best practices 
