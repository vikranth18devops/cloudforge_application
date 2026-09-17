# 🟩 GCP Production Deployment Documentation Guide (Steps 01 - 09)

<p align="left">
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
  <img src="https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" />
  <img src="https://img.shields.io/badge/Helm-v3-0F1689?style=for-the-badge&logo=helm&logoColor=white" />
  <img src="https://img.shields.io/badge/ArgoCD-GitOps-EF6B48?style=for-the-badge&logo=argo&logoColor=white" />
  <img src="https://img.shields.io/badge/Prometheus_Grafana-Observability-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" />
</p>

A complete, beginner-friendly 9-step production deployment and operations guide for running **CloudForge** on **Google Cloud Platform (GCP)**.

---

## 🔄 End-to-End Chronological Execution Sequence

```
1. Prerequisites & Local Tools Setup (gcloud, kubectl, terraform, helm, docker)
   │
   ▼
2. App Development, Code Quality (Oxlint) & Compilation (npm run build)
   │
   ▼
3. Security Auditing (CodeQL SAST, NPM Audit SCA, Trivy & OWASP ZAP DAST)
   │
   ▼
4. Infrastructure as Code Provisioning (Terraform & GCS Remote State)
   │
   ▼
5. Docker Container Build & GCP Artifact Registry Image Publishing
   │
   ▼
6. Helm Packaging & Automated Values Tag Update (infra/helm/values.yaml)
   │
   ▼
7. ArgoCD GitOps Continuous Delivery & Cluster Auto-Sync (infra/argocd/)
   │
   ▼
8. Prometheus Metrics & Grafana Observability Monitoring (infra/monitoring/)
   │
   ▼
9. GitHub Actions Automated Pipeline (.github/workflows/ci.yml)
```

---

## 🌐 Single-Point Routing Architecture Matrix

| Route Path | Service Component | Ingress Backend Target | Protocol |
|---|---|---|---|
| `/` | **React SPA Frontend** | `cloudforge-frontend-service:80` | HTTPS (TLS) |
| `/api` | **Node.js Express API** | `cloudforge-backend-service:5000` | HTTPS (TLS) |
| `/argocd` | **ArgoCD Controller** | `argocd-server:80` | HTTPS (TLS) |
| `/grafana` | **Grafana Dashboards** | `grafana-service:3000` | HTTPS (TLS) |
| `/prometheus` | **Prometheus Metrics** | `prometheus-service:9090` | HTTPS (TLS) |

---

## 📚 Sequenced Step-by-Step Documentation Guides (Steps 01 - 09)

Click any step below for detailed manual & GitHub Actions instructions:

1. 🔹 [**01 - Prerequisites & Local Tools Setup Guide**](./01-prerequisites-and-local-setup.md)
2. 🔹 [**02 - Local App Development & Code Quality Guide**](./02-app-development-and-code-quality.md)
3. 🔹 [**03 - DevSecOps Auditing (SAST, SCA, Trivy & OWASP ZAP DAST)**](./03-security-sast-sca-dast-scans.md)
4. 🔹 [**04 - Infrastructure as Code & GCS Remote State Management**](./04-terraform-infrastructure-iac.md)
5. 🔹 [**05 - Docker Container Build & Google Artifact Registry Publish**](./05-container-build-and-gcp-publish.md)
6. 🔹 [**06 - Helm Packaging & Automated Values Tag Update Guide**](./06-helm-packaging-and-tag-update.md)
7. 🔹 [**07 - ArgoCD GitOps Continuous Delivery & Cluster Sync**](./07-argocd-gitops-continuous-delivery.md)
8. 🔹 [**08 - Prometheus & Grafana Observability Monitoring Guide**](./08-prometheus-grafana-monitoring.md)
9. 🔹 [**09 - GitHub Actions Automated CI/CD Pipeline Setup**](./09-github-actions-cicd-automation.md)

---

## ⚡ Emergency Rollback Procedure

```bash
# Rollback Helm Release
helm rollback cloudforge 1 --namespace production

# Rollback ArgoCD Application
argocd app rollback cloudforge-prod
```
