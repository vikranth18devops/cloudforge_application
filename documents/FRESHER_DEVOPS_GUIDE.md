# 🚀 Beginner-Friendly Phase-by-Phase DevOps Implementation Guide

> **Target Audience**: Freshers / Beginners with zero prior DevOps experience.  
> **Goal**: Learn and deploy the **CloudForge** application step-by-step from zero to a fully automated DevSecOps GitOps cloud architecture.

---

## 📋 Table of Contents
1. [Prerequisites & Tools Setup](#phase-1-prerequisites--tools-setup)
2. [Local Development & Application Architecture](#phase-2-local-development--app-architecture)
3. [Containerization with Docker](#phase-3-containerization-with-docker)
4. [DevSecOps Security Scanning](#phase-4-devsecops-security-scanning)
5. [Infrastructure as Code (Terraform on GCP)](#phase-5-infrastructure-as-code-terraform-on-gcp)
6. [Kubernetes Packaging with Helm](#phase-6-kubernetes-packaging-with-helm)
7. [GitOps Deployment with ArgoCD](#phase-7-gitops-deployment-with-argocd)
8. [Monitoring & Observability (Prometheus & Grafana)](#phase-8-monitoring--observability-prometheus--grafana)
9. [Automated CI/CD Pipeline (GitHub Actions)](#phase-9-automated-cicd-pipeline-github-actions)

---

## Phase 1: Prerequisites & Tools Setup

Before writing any commands, install these essential software tools on your machine:

| Tool | What it does | Installation Link / Command |
|---|---|---|
| **Node.js (v20+) & npm** | Runs JavaScript/TypeScript frontend and backend | [nodejs.org](https://nodejs.org/) |
| **Git** | Code version control | `brew install git` (Mac) or [git-scm.com](https://git-scm.com/) |
| **Docker Desktop** | Builds and runs containerized applications | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Terraform CLI** | Provisions cloud resources via code | `brew install terraform` |
| **Google Cloud SDK (`gcloud`)** | Connects to your GCP Cloud account | [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install) |
| **Helm CLI** | Manages Kubernetes app packages | `brew install helm` |
| **kubectl** | Controls Kubernetes clusters | `brew install kubectl` |

### Step 1.1: Verify Tool Installation
Open your terminal (Terminal on Mac, PowerShell on Windows) and run:
```bash
node -v      # Should output v20.x or higher
npm -v       # Should output 10.x or higher
docker -v    # Should output Docker version
terraform -v # Should output Terraform v1.5+
helm version # Should output v3.x
gcloud -v    # Should output Google Cloud SDK version
```

---

## Phase 2: Local Development & App Architecture

CloudForge consists of two main parts:
1. **Frontend**: React single-page app built with Vite (`src/`).
2. **Backend API**: Node.js Express server (`server/index.js`) communicating with a PostgreSQL database.

### Step 2.1: Clone Repository & Install Dependencies
```bash
git clone https://github.com/vikranth18devops/cloudforge_application.git
cd cloudforge_application
npm install
```

### Step 2.2: Start Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`. You should see the CloudForge application dashboard!

---

## Phase 3: Containerization with Docker

Containers bundle our application code and runtime dependencies together so it runs identically on any server.

### Step 3.1: Build Backend Container Image
```bash
docker build -t cloudforge-backend:1.0.0 ./server
```

### Step 3.2: Verify Built Docker Image
```bash
docker images | grep cloudforge-backend
```

### Step 3.3: Run Multi-Container Stack (App + Postgres DB)
```bash
docker compose up -d
```
Check running containers:
```bash
docker ps
```
To stop the local containers:
```bash
docker compose down
```

---

## Phase 4: DevSecOps Security Scanning

DevSecOps ensures we catch security vulnerabilities **before** deploying to production.

### Step 4.1: Run Code Quality Linter
```bash
npx oxlint
```

### Step 4.2: Audit NPM Dependencies (SCA)
```bash
npm audit
```

### Step 4.3: Trivy Security Scan (IaC & Container)
```bash
# Scan Terraform IaC files for security misconfigurations
trivy config infra/terraform/

# Scan local backend Docker container for image vulnerabilities
trivy image cloudforge-backend:1.0.0
```

---

## Phase 5: Infrastructure as Code (Terraform on GCP)

Terraform allows us to create GCP cloud resources (Cloud Run, Cloud SQL, Cloud Storage, Artifact Registry) using configuration code instead of clicking in the cloud console.

### Step 5.1: Authenticate to GCP
```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_GCP_PROJECT_ID
```

### Step 5.2: Navigate to Terraform Directory
```bash
cd infra/terraform
```

### Step 5.3: Initialize & Plan Infrastructure
```bash
# Initialize Terraform plugins
terraform init

# Check what resources will be created
terraform plan -var="gcp_project_id=YOUR_GCP_PROJECT_ID" -var="db_password=SuperSecretPass123!"
```

### Step 5.4: Apply & Create GCP Infrastructure
```bash
terraform apply -auto-approve -var="gcp_project_id=YOUR_GCP_PROJECT_ID" -var="db_password=SuperSecretPass123!"
```

---

## Phase 6: Kubernetes Packaging with Helm

Helm is a package manager for Kubernetes (like `apt` or `npm`, but for K8s apps).

### Step 6.1: Navigate to Helm Directory
```bash
cd ../helm
```

### Step 6.2: Lint Helm Chart
```bash
helm lint ./
```

### Step 6.3: Perform Template Dry Run
```bash
helm template cloudforge ./ --values values.yaml
```

### Step 6.4: Install Chart onto Kubernetes Cluster
```bash
kubectl create namespace production
helm install cloudforge ./ --namespace production
```

---

## Phase 7: GitOps Deployment with ArgoCD

GitOps means **Git is the single source of truth**. When you push code changes to GitHub, ArgoCD automatically updates the live Kubernetes cluster to match.

### Step 7.1: Apply ArgoCD Project Definition
```bash
kubectl apply -f infra/argocd/appproject.yaml -n argocd
```

### Step 7.2: Apply ArgoCD Application Manifest
```bash
kubectl apply -f infra/argocd/application.yaml -n argocd
```

### Step 7.3: Check ArgoCD Sync Status
```bash
kubectl get application -n argocd
```

---

## Phase 8: Monitoring & Observability (Prometheus & Grafana)

Monitoring allows us to view real-time graphs of CPU usage, RAM usage, HTTP request rates, and error logs.

### Step 8.1: Deploy Prometheus & Grafana to Kubernetes
```bash
kubectl create namespace monitoring
kubectl apply -f infra/monitoring/prometheus/ -n monitoring
kubectl apply -f infra/monitoring/grafana/ -n monitoring
```

### Step 8.2: Port-Forward Grafana to your Local Browser
```bash
kubectl port-forward svc/grafana-service 3000:3000 -n monitoring
```

### Step 8.3: Login to Grafana
- **URL**: `http://localhost:3000`
- **Username**: `admin`
- **Password**: `CloudForgeAdmin2026!`

*(Alternative for local non-K8s testing)*:
```bash
docker compose -f infra/monitoring/docker-compose.monitoring.yml up -d
```

---

## Phase 9: Automated CI/CD Pipeline (GitHub Actions)

Instead of running steps manually, GitHub Actions automates everything whenever code is pushed to `main`.

### Pipeline Execution Order:
```
[Push to GitHub main branch]
       │
       ▼
 1. Stage 1: Code Quality (Oxlint)
       │
       ▼
 2. Stage 2: DevSecOps Scans (CodeQL SAST + Trivy IaC + npm audit)
       │
       ▼
 3. Stage 3: Build Bundle (npm run build)
       │
       ▼
 4. Stage 4: IaC & Helm Validation (terraform fmt + helm lint)
       │
       ▼
 5. Stage 5: Container Build & DAST (Docker + Trivy Container + OWASP ZAP)
       │
       ▼
 6. Stage 6: GCP Production Deployment (Terraform apply + Cloud Run + GCS Bucket)
```

### Setting Up Required GitHub Repository Secrets:
Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions** -> Add:
- `GCP_PROJECT_ID`: Your GCP project ID.
- `GCP_SA_KEY`: Service account JSON key with GCP Admin permissions.
- `DB_PASSWORD`: Strong password for PostgreSQL database.

---

## 🎯 Summary Checklist for Beginners

- [x] **Phase 1**: Installed Node.js, Git, Docker, Terraform, Helm, and gcloud CLI.
- [x] **Phase 2**: Verified local React frontend and Express backend.
- [x] **Phase 3**: Built Docker backend container image.
- [x] **Phase 4**: Scanned code with Oxlint & Trivy security tools.
- [x] **Phase 5**: Provisioned GCP resources via `infra/terraform`.
- [x] **Phase 6**: Package Kubernetes manifests using `infra/helm`.
- [x] **Phase 7**: Automated CD deployments via `infra/argocd`.
- [x] **Phase 8**: Monitored cluster metrics using `infra/monitoring`.
- [x] **Phase 9**: Configured end-to-end CI/CD in `.github/workflows/ci.yml`.
