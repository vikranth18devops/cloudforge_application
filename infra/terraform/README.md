# 🏗️ CloudForge GCP Terraform Infrastructure (Option 1)

Production-grade **Terraform Infrastructure as Code (IaC)** for provisioning CloudForge on **Google Cloud Platform (GCP)** using Serverless Containers and Cloud SQL.

---

## 🏛️ Architecture Overview

```
                        ┌───────────────────────────────┐
                        │   GCP Artifact Registry Repo  │
                        │   (Docker Container Registry)  │
                        └───────────────┬───────────────┘
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
┌─────────────────────────────┐                           ┌───────────────────────────┐
│ Google Cloud Storage (GCS)  │                           │    Google Cloud Run v2    │
│ SPA Static Web Hosting      │                           │  Express Node API Service │
└─────────────────────────────┘                           └─────────────┬─────────────┘
                                                                        │ (Cloud SQL Proxy)
                                                                        ▼
                                                          ┌───────────────────────────┐
                                                          │   Cloud SQL PostgreSQL    │
                                                          │   Managed Database        │
                                                          └───────────────────────────┘
```

---

## 📁 Infrastructure Module Structure

```
infra/
├── main.tf                      # GCP provider setup & module wiring
├── variables.tf                 # Global Terraform variables
├── outputs.tf                   # Deployment endpoints & resource identifiers
├── terraform.tfvars.example     # Sample environment configuration
├── README.md                    # Infrastructure deployment guide
└── modules/
    ├── artifact_registry/       # GCP Artifact Registry repo module
    ├── database/                # Cloud SQL PostgreSQL instance & user module
    ├── cloud_run/               # Cloud Run v2 API service & IAM module
    └── storage/                 # GCS SPA static website bucket module
```

---

## 🚀 Step-by-Step Deployment Guide

### Prerequisites
1. **Google Cloud SDK (`gcloud`)** installed and authenticated:
   ```bash
   gcloud auth login
   gcloud auth application-default login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```
2. **Terraform CLI** installed (`>= 1.5.0`):
   ```bash
   terraform version
   ```

---

### Step 1: Configure Variables
Copy `terraform.tfvars.example` to `terraform.tfvars` and set your GCP credentials:
```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
```
Edit `terraform.tfvars`:
```hcl
gcp_project_id = "my-gcp-project-123"
gcp_region     = "us-central1"
db_password    = "StrongDBPassphrase123!"
```

---

### Step 2: Initialize Terraform
```bash
terraform init
```

---

### Step 3: Provision Artifact Registry First (Optional / Recommended)
Provision the repository before pushing your initial Docker container image:
```bash
terraform apply -target=module.artifact_registry
```

Build and push the Express API Docker image to the created repository:
```bash
# Authenticate Docker to GCP Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build & push backend image
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/cloudforge-app-repo/backend:latest ../server
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/cloudforge-app-repo/backend:latest
```

---

### Step 4: Apply Full Infrastructure
```bash
terraform plan
terraform apply -auto-approve
```

---

### Step 5: Deploy Frontend SPA to Cloud Storage
Build the React application static bundle:
```bash
cd ..
npm run build
```

Upload the `dist/` build directory to your provisioned GCS bucket:
```bash
# Substitute your actual bucket name from terraform output
gcloud storage cp -r dist/* gs://cloudforge-frontend-YOUR_PROJECT_ID-production/
```

---

## 🔍 Outputs & Useful Commands

After running `terraform apply`, Terraform outputs the key URLs:
- **Cloud Run API Endpoint**: `https://cloudforge-backend-api-xxxx-uc.a.run.app`
- **Frontend GCS Website**: `http://storage.googleapis.com/cloudforge-frontend-YOUR_PROJECT_ID-production/index.html`
- **Cloud SQL Connection Name**: `YOUR_PROJECT_ID:us-central1:cloudforge-pg-production`

### Tear Down Infrastructure
To destroy all provisioned GCP resources:
```bash
terraform destroy
```
