variable "gcp_project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for the repository"
  type        = string
  default     = "us-central1"
}

variable "repository_id" {
  description = "Name of the Artifact Registry repository"
  type        = string
  default     = "cloudforge-repo"
}
