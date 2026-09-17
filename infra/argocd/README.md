# ArgoCD GitOps Deployment

This directory contains ArgoCD declarative custom resources for GitOps continuous delivery of CloudForge.

## Files

```
infra/argocd/
├── application.yaml      # ArgoCD Application resource targeting infra/helm chart
├── appproject.yaml       # ArgoCD AppProject establishing RBAC boundaries
├── applicationset.yaml   # Multi-environment generator (dev, staging, prod)
└── README.md             # ArgoCD setup guide
```

## Quick Start

### 1. Apply ArgoCD AppProject
```bash
kubectl apply -f infra/argocd/appproject.yaml -n argocd
```

### 2. Apply ArgoCD Application
```bash
kubectl apply -f infra/argocd/application.yaml -n argocd
```

### 3. Deploy Multi-Environment ApplicationSet
```bash
kubectl apply -f infra/argocd/applicationset.yaml -n argocd
```

### 4. Check ArgoCD Status via CLI
```bash
argocd app get cloudforge-prod
argocd app sync cloudforge-prod
```
