variable "gcp_project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for the Cloud Run service"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "Name of the Cloud Run service"
  type        = string
  default     = "cloudforge-backend-api"
}

variable "container_image" {
  description = "Full Artifact Registry Docker image URI"
  type        = string
}

variable "cloud_sql_connection_name" {
  description = "Cloud SQL connection string (PROJECT_ID:REGION:INSTANCE_NAME)"
  type        = string
}

variable "db_name" {
  description = "PostgreSQL Database Name"
  type        = string
  default     = "cloudforge"
}

variable "db_user" {
  description = "PostgreSQL DB Username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL DB Password"
  type        = string
  sensitive   = true
}
