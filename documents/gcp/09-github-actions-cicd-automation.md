# 09 - GitHub Actions Automated CI/CD Pipeline (`.github/workflows/ci.yml`)

<p align="left">
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
  <img src="https://img.shields.io/badge/Automation-Unified_Pipeline-00C7B7?style=for-the-badge" />
</p>

## 📌 Step 9: End-to-End Automated CI/CD Pipeline Setup

Details the unified multi-stage automated pipeline defined in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

---

## ⚙️ Automated Execution Process Flowchart

```
1. Developer pushes code commit to main branch
   │
   ▼
2. GitHub Actions runs CI/CD pipeline (.github/workflows/ci.yml)
   ├── Stage 1: Oxlint syntax check
   ├── Stage 2: CodeQL SAST & Trivy IaC scans
   ├── Stage 3: Build production bundle (npm run build)
   ├── Stage 4: Verify Terraform fmt & Helm chart linting
   └── Stage 5: Container build & OWASP ZAP DAST scan
   │
   ▼
3. Stage 6 publishes container image to GCP Artifact Registry
   gcr.io/cloudforge-project/cloudforge-backend:${{ github.sha }}
   │
   ▼
4. Stage 6 updates tag in infra/helm/values.yaml and commits back to GitHub
   │
   ▼
5. Stage 6 executes Terraform Infrastructure apply (infra/terraform/)
   │
   ▼
6. ArgoCD Controller detects updated Helm values and auto-syncs deployment to K8s
   │
   ▼
7. Prometheus & Grafana monitoring stack tracks live cluster health
```

---

## 🔑 Required GitHub Repository Secrets

Configure the following secrets under **GitHub Repo** -> **Settings** -> **Secrets and variables** -> **Actions**:

| Secret Name | Description | Example / Required Format |
|---|---|---|
| `GCP_PROJECT_ID` | Google Cloud Project ID | `cloudforge-prod-12345` |
| `GCP_SA_KEY` | Service Account JSON Key | `{ "type": "service_account", ... }` |
| `DB_PASSWORD` | PostgreSQL Database Admin Password | `SuperSecurePassword123!` |
