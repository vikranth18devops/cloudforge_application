resource "google_storage_bucket" "frontend" {
  provider                    = google
  project                     = var.gcp_project_id
  name                        = var.bucket_name
  location                    = var.gcp_region
  force_destroy               = true
  uniform_bucket_level_access = false

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = {
    environment = var.environment
    app         = "cloudforge"
  }
}

# Grant public access for static web hosting
resource "google_storage_bucket_access_control" "public_rule" {
  bucket = google_storage_bucket.frontend.name
  role   = "READER"
  entity = "allUsers"
}
