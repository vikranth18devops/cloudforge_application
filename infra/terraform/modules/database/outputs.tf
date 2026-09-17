output "connection_name" {
  description = "The Cloud SQL connection name (PROJECT_ID:REGION:INSTANCE_NAME)"
  value       = google_sql_database_instance.postgres.connection_name
}

output "instance_name" {
  description = "The Cloud SQL instance name"
  value       = google_sql_database_instance.postgres.name
}

output "public_ip_address" {
  description = "The public IP address of the Cloud SQL instance"
  value       = google_sql_database_instance.postgres.public_ip_address
}

output "database_name" {
  description = "Name of the database created"
  value       = google_sql_database.db.name
}
