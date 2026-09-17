terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.15"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# 1. Artifact Registry Module (Docker Repo)
module "artifact_registry" {
  source         = "./modules/artifact_registry"
  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
  repository_id  = "cloudforge-app-repo"
}

# 2. Cloud SQL PostgreSQL Instance & Database Module
module "database" {
  source         = "./modules/database"
  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
  instance_name  = "cloudforge-pg-${var.environment}"
  database_name  = "cloudforge"
  db_username    = "postgres"
  db_password    = var.db_password
}

# 3. Google Cloud Storage Module (Static Frontend Website)
module "storage" {
  source         = "./modules/storage"
  gcp_project_id = var.gcp_project_id
  gcp_region     = var.gcp_region
  bucket_name    = "cloudforge-frontend-${var.gcp_project_id}-${var.environment}"
  environment    = var.environment
}

# 4. Google Cloud Run Service Module (Node.js Express API)
module "cloud_run" {
  source                    = "./modules/cloud_run"
  gcp_project_id            = var.gcp_project_id
  gcp_region                = var.gcp_region
  service_name              = "cloudforge-backend-api"
  container_image           = var.container_image != "" ? var.container_image : "${module.artifact_registry.repository_url}/backend:latest"
  cloud_sql_connection_name = module.database.connection_name
  db_name                   = module.database.database_name
  db_user                   = "postgres"
  db_password               = var.db_password
}
