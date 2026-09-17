# Terraform Remote State Backend Storage in Google Cloud Storage (GCS)
# This enables centralized state management, versioning, and state locking across team members and CI/CD pipelines.

terraform {
  backend "gcs" {
    bucket = "cloudforge-tfstate-bucket"
    prefix = "terraform/state"
  }
}
