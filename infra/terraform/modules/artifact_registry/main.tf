resource "google_artifact_registry_repository" "repo" {
  provider      = google
  project       = var.gcp_project_id
  location      = var.gcp_region
  repository_id = var.repository_id
  description   = "Docker container repository for CloudForge microservices"
  format        = "DOCKER"

  docker_config {
    immutable_tags = false
  }
}
