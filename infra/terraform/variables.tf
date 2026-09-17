variable "gcp_project_id" {
  description = "The GCP Project ID where resources will be provisioned"
  type        = string
}

variable "gcp_region" {
  description = "Primary GCP region for infrastructure deployment"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Deployment environment name (production/staging)"
  type        = string
  default     = "production"
}

variable "db_password" {
  description = "Master password for Cloud SQL PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "container_image" {
  description = "Full Artifact Registry URI for backend API container image (optional override)"
  type        = string
  default     = ""
}
