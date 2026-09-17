# 01 - Prerequisites & Local Tools Setup Guide

<p align="left">
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />
  <img src="https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" />
  <img src="https://img.shields.io/badge/Helm-v3-0F1689?style=for-the-badge&logo=helm&logoColor=white" />
  <img src="https://img.shields.io/badge/ArgoCD-GitOps-EF6B48?style=for-the-badge&logo=argo&logoColor=white" />
</p>

## 📌 Step 1: Install Required Tools (macOS, Linux, Windows)

To work with CloudForge DevOps on Google Cloud Platform, install these core tools:

---

### 1️⃣ Google Cloud SDK (`gcloud` CLI)

#### 🍏 macOS (Homebrew)
```bash
brew install --cask google-cloud-sdk
gcloud components install gke-gcloud-auth-plugin
```

#### 🐧 Linux (Debian / Ubuntu)
```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install -y google-cloud-cli google-cloud-cli-gke-gcloud-auth-plugin
```

#### 🔑 Local GCP Authentication
```bash
gcloud auth login
gcloud auth application-default login

export GCP_PROJECT_ID="your-gcp-project-id"
export GCP_REGION="us-central1"
gcloud config set project $GCP_PROJECT_ID
```

---

### 2️⃣ Kubernetes CLI (`kubectl`)
```bash
# macOS
brew install kubectl
```

---

### 3️⃣ Terraform CLI (v1.5+)
```bash
# macOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

---

### 4️⃣ Helm 3 Package Manager
```bash
# macOS
brew install helm
```

---

### 5️⃣ Docker Desktop & Container Engine
```bash
# macOS
brew install --cask docker
```

---

## ⚙️ Enable GCP APIs

```bash
gcloud services enable \
  compute.googleapis.com \
  container.googleapis.com \
  cloudresourcemanager.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  storage-component.googleapis.com
```

---

## 🔍 Verification Check
```bash
gcloud services list --enabled | grep -E "run|container|sql|artifactregistry|storage"
```
