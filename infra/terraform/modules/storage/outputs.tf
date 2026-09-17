output "bucket_name" {
  description = "The name of the static website storage bucket"
  value       = google_storage_bucket.frontend.name
}

output "bucket_url" {
  description = "GCS Storage URL for static assets"
  value       = google_storage_bucket.frontend.url
}

output "website_url" {
  description = "Direct HTTP website endpoint URL"
  value       = "http://storage.googleapis.com/${google_storage_bucket.frontend.name}/index.html"
}
