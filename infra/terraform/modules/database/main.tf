resource "google_sql_database_instance" "postgres" {
  provider            = google
  project             = var.gcp_project_id
  name                = var.instance_name
  database_version    = "POSTGRES_15"
  region              = var.gcp_region
  deletion_protection = false

  settings {
    tier              = var.tier
    availability_type = "ZONAL"
    disk_size         = 20
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }

    ip_configuration {
      ipv4_enabled = true
      ssl_mode     = "ALLOW_UNENCRYPTED_AND_ENCRYPTED"
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }
}

resource "google_sql_database" "db" {
  provider = google
  project  = var.gcp_project_id
  name     = var.database_name
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "user" {
  provider = google
  project  = var.gcp_project_id
  name     = var.db_username
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}
