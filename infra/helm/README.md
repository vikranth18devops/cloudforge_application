# CloudForge Helm Chart

This folder contains the Helm 3 package chart for deploying CloudForge (React frontend SPA & Node.js backend API) onto Kubernetes/GKE.

## Structure

```
infra/helm/
├── Chart.yaml              # Chart definition and metadata
├── values.yaml             # Default configuration values
├── README.md               # Helm usage documentation
└── templates/
    ├── _helpers.tpl        # Naming and label helpers
    ├── configmap.yaml      # Environment variables ConfigMap
    ├── secret.yaml         # DB & JWT credentials Secret
    ├── backend-deployment.yaml  # Node.js backend Deployment
    ├── backend-service.yaml     # Node.js backend Service
    ├── frontend-deployment.yaml # React frontend Deployment
    ├── frontend-service.yaml    # React frontend Service
    ├── ingress.yaml        # NGINX/GCE Ingress manifest
    └── hpa.yaml            # Horizontal Pod Autoscaler
```

## Quick Start

### 1. Validate & Lint Chart
```bash
helm lint ./infra/helm
```

### 2. Render Template Dry Run
```bash
helm template cloudforge ./infra/helm --values ./infra/helm/values.yaml
```

### 3. Install Chart
```bash
helm install cloudforge ./infra/helm --namespace production --create-namespace
```

### 4. Upgrade Release
```bash
helm upgrade cloudforge ./infra/helm --namespace production -f ./infra/helm/values.yaml
```

### 5. Uninstall Release
```bash
helm uninstall cloudforge --namespace production
```
