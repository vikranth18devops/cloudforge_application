# 04 - Infrastructure as Code & GCS Remote State Management

<p align="left">
  <img src="https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Cloud_Storage-Remote_State-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/State_Locking-Enabled-00C7B7?style=for-the-badge" />
</p>

## 📌 Step 4: Provision Cloud Infrastructure with Terraform

Executes Terraform Infrastructure-as-Code modules under [`infra/terraform/`](../../infra/terraform) using **Google Cloud Storage (GCS) Remote State Backend** (`backend.tf`) for state locking and infrastructure provisioning.

---

## 🗄️ Terraform Remote State Architecture (`backend.tf`)

```
                          ┌──────────────────────────────┐
                          │ Developer Local Workstation  │
                          │ or GitHub Actions Pipeline   │
                          └──────────────┬───────────────┘
                                         │  terraform init / apply
                                         ▼
                          ┌──────────────────────────────┐
                          │ GCS Remote State Bucket      │
                          │ gs://cloudforge-tfstate-bucket
                          │   └── terraform/state/default.tfstate
                          └──────────────────────────────┘
```

---

## 💻 1️⃣ Manual CLI Instructions

```bash
# 1. Create State Bucket once
export TF_STATE_BUCKET="cloudforge-tfstate-$GCP_PROJECT_ID"
gcloud storage buckets create gs://$TF_STATE_BUCKET --project=$GCP_PROJECT_ID --location=$GCP_REGION --uniform-bucket-level-access
gcloud storage buckets update gs://$TF_STATE_BUCKET --versioning

# 2. Init & Apply Terraform
cd infra/terraform
terraform init -backend-config="bucket=$TF_STATE_BUCKET" -reconfigure
terraform apply -auto-approve -var="gcp_project_id=$GCP_PROJECT_ID" -var="gcp_region=$GCP_REGION" -var="db_password=SuperSecurePassword123!"
```

---

## ⚙️ 2️⃣ GitHub Actions Automated Integration (`.github/workflows/ci.yml`)

Executed in **Stage 4** (formatting validation) and **Stage 6** (provisioning):

```yaml
# Stage 4: Verify Formatting
- name: Verify Terraform Formatting
  run: terraform fmt -check -recursive infra/terraform/

# Stage 6: Execute Terraform Apply
- name: Setup Terraform
  uses: hashicorp/setup-terraform@v3
  with:
    terraform_version: 1.5.7

- name: Execute Terraform Infrastructure Apply
  run: |
    cd infra/terraform
    terraform init -backend-config="bucket=cloudforge-tfstate-${{ env.GCP_PROJECT_ID }}" -reconfigure || terraform init -reconfigure
    terraform apply -auto-approve \
      -var="gcp_project_id=${{ env.GCP_PROJECT_ID }}" \
      -var="gcp_region=${{ env.GCP_REGION }}" \
      -var="db_password=${{ env.DB_PASSWORD }}"
```

---

## 🔍 3️⃣ Verification Check
```bash
terraform state list
```
