# CloudForge Infrastructure Architecture (`infra/`)

This directory contains the complete Infrastructure as Code (IaC), Kubernetes packaging, GitOps deployment resources, and observability monitoring stacks for CloudForge.

---

## Directory Overview

```
infra/
├── terraform/          # 1. Infrastructure as Code (GCP Cloud Run, Cloud SQL PostgreSQL, GCS, Artifact Registry)
├── helm/               # 2. Kubernetes Helm 3 Package Chart (Frontend SPA, Node.js API, Secrets, ConfigMaps, Ingress)
├── argocd/             # 3. GitOps Continuous Delivery (Application, AppProject, ApplicationSet)
└── monitoring/         # 4. Observability & Monitoring (Prometheus Metrics & Grafana Dashboards)
```

---

## Component Guide

### 1. Terraform Infrastructure (`infra/terraform/`)
- **Modules**:
  - `artifact_registry`: Google Artifact Registry Docker image repository.
  - `database`: Cloud SQL PostgreSQL database instance.
  - `storage`: Google Cloud Storage bucket for static frontend SPA hosting.
  - `cloud_run`: Google Cloud Run service for backend Node.js API.
- **Commands**:
  ```bash
  cd infra/terraform
  terraform init
  terraform plan
  terraform apply -auto-approve
  ```

---

### 2. Helm Kubernetes Packaging (`infra/helm/`)
- **Templates**: Deployment, Service, ConfigMap, Secret, Ingress, and HorizontalPodAutoscaler.
- **Commands**:
  ```bash
  helm lint ./infra/helm
  helm template cloudforge ./infra/helm
  helm install cloudforge ./infra/helm --namespace production --create-namespace
  ```

---

### 3. ArgoCD GitOps (`infra/argocd/`)
- **Manifests**:
  - `application.yaml`: Production Application resource pointing to `infra/helm`.
  - `appproject.yaml`: Scope and RBAC definitions for CloudForge.
  - `applicationset.yaml`: Multi-environment cluster deployment generator (`dev`, `staging`, `prod`).
- **Commands**:
  ```bash
  kubectl apply -f infra/argocd/appproject.yaml -n argocd
  kubectl apply -f infra/argocd/application.yaml -n argocd
  ```

---

### 4. Prometheus & Grafana Monitoring (`infra/monitoring/`)
- **Stack**:
  - `prometheus/`: Scrape configuration for `/api/metrics` and K8s node exporter.
  - `grafana/`: Pre-built dashboard for HTTP request rates, average response latency, and Node.js process CPU/Memory.
- **Commands**:
  ```bash
  # Deploy to Kubernetes
  kubectl apply -f infra/monitoring/prometheus/ -n monitoring
  kubectl apply -f infra/monitoring/grafana/ -n monitoring

  # Local Docker Testing
  docker compose -f infra/monitoring/docker-compose.monitoring.yml up -d
  ```

---

## GitHub Actions Integration

The main pipeline defined in [`.github/workflows/ci.yml`](file:///Users/aarvik/Documents/devops/.github/workflows/ci.yml) automates all stages:
1. **Stage 1**: Linter syntax checks (`npx oxlint`).
2. **Stage 2**: SAST & Security Auditing (`npm audit`, CodeQL, Trivy IaC scan on `infra/terraform/`).
3. **Stage 3**: Compilation & Application Build (`npm run build`).
4. **Stage 4**: Infrastructure & Helm Validation (`terraform fmt -check`, `helm lint ./infra/helm`).
5. **Stage 5**: Container Security & DAST Scan (Docker build, Trivy container scan, OWASP ZAP DAST scan).
6. **Stage 6**: GCP Infrastructure Provisioning & Deployment (`cd infra/terraform && terraform apply`, Artifact Registry upload, Cloud Run & GCS deploy).
