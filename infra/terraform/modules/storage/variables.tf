variable "gcp_project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for the storage bucket"
  type        = string
  default     = "us-central1"
}

variable "bucket_name" {
  description = "Globally unique name for the GCS SPA frontend bucket"
  type        = string
}

variable "environment" {
  description = "Deployment environment (production/staging)"
  type        = string
  default     = "production"
}
