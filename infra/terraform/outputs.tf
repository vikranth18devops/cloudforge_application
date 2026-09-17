output "artifact_registry_url" {
  description = "Artifact Registry Docker push URI"
  value       = module.artifact_registry.repository_url
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name string"
  value       = module.database.connection_name
}

output "cloud_sql_public_ip" {
  description = "Cloud SQL Instance IP Address"
  value       = module.database.public_ip_address
}

output "cloud_run_api_url" {
  description = "Deployed Cloud Run API Endpoint URL"
  value       = module.cloud_run.service_url
}

output "frontend_gcs_website_url" {
  description = "Static Frontend GCS Website URL"
  value       = module.storage.website_url
}

output "frontend_bucket_name" {
  description = "Static Frontend GCS Bucket Name"
  value       = module.storage.bucket_name
}
