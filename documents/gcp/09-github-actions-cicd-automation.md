# 09 - GitHub Actions Automated CI/CD Pipeline (`.github/workflows/ci.yml`)

<p align="left">
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
  <img src="https://img.shields.io/badge/Automation-Unified_Pipeline-00C7B7?style=for-the-badge" />
</p>

## 📌 Step 9: End-to-End Automated CI/CD Pipeline Setup

Details the unified multi-stage automated pipeline defined in [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

---

## ⚙️ Automated Execution Process Flowchart (Parallel DAG)

```
                       1. Developer pushes commit to main
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
   [Stage 1: Linting]        [Stage 2: Security]       [Stage 4: IaC/Helm]
   (Oxlint Syntax Check)     (CodeQL SAST & Trivy)     (Terraform & Helm Lint)
            │                          │                          │
      ┌─────┴──────────────┐           │                          │
      ▼                    ▼           │                          │
[Stage 3A: Frontend]  [Stage 3B: Backend] │                       │
 (React App Build)     (Express API Check)│                       │
      │                    │           │                          │
      └─────┬──────────────┘           │                          │
            ▼                          │                          │
   [Stage 5: Container Scan]           │                          │
   (Docker & ZAP DAST)                 │                          │
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       │ (All dependencies pass)
                                       ▼
                     [Stage 6: GCP Production Deployment]
                      ├── Publish Docker Image to GCP Artifact Registry
                      ├── Update Helm Chart values.yaml (auto-commit tag)
                      ├── Execute Terraform apply (remote GCS state)
                      ├── Trigger ArgoCD GitOps Cluster Auto-Sync
                      └── Verify Prometheus/Grafana Stack Health
```

---

## 🔑 Required GitHub Repository Secrets

Configure the following secrets under **GitHub Repo** -> **Settings** -> **Secrets and variables** -> **Actions**:

| Secret Name | Description | Example / Required Format |
|---|---|---|
| `GCP_PROJECT_ID` | Google Cloud Project ID | `cloudforge-prod-12345` |
| `GCP_SA_KEY` | Service Account JSON Key | `{ "type": "service_account", ... }` |
| `DB_PASSWORD` | PostgreSQL Database Admin Password | `SuperSecurePassword123!` |
