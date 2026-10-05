terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.9"
    }
  }
}

provider "google" {
  region = "europe-west1"
}

provider "google-beta" {
  region                = "europe-west1"
  user_project_override = true
}

# ------------------------------------------------------------------
# 1. Use the existing Firebase project
# ------------------------------------------------------------------
data "google_project" "default" {
  project_id = var.project_id
}

# USED FOR TUTORIAL DEMO, WHOLE THING CAN BE REMOVED TO TRIGGER AN ERROR FROM A CHECK
# ------------------------------------------------------------------
# 1b. Cloud Audit Logging for all services and all users. 
# ------------------------------------------------------------------
resource "google_project_iam_audit_config" "default" {
  project = data.google_project.default.project_id
  service = "allServices"

  audit_log_config {
    log_type = "ADMIN_READ"
  }
  audit_log_config {
    log_type = "DATA_READ"
  }
  audit_log_config {
    log_type = "DATA_WRITE"
  }
}

# ------------------------------------------------------------------
# 2. Enable the required APIs
# ------------------------------------------------------------------
resource "google_project_service" "firebase" {
  project            = data.google_project.default.project_id
  service            = "firebase.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "firestore" {
  project            = data.google_project.default.project_id
  service            = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "firebaserules" {
  project            = data.google_project.default.project_id
  service            = "firebaserules.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloudresourcemanager" {
  project            = data.google_project.default.project_id
  service            = "cloudresourcemanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "serviceusage" {
  project            = data.google_project.default.project_id
  service            = "serviceusage.googleapis.com"
  disable_on_destroy = false
}

# ------------------------------------------------------------------
# 3. Add Firebase to the project
# ------------------------------------------------------------------
resource "time_sleep" "wait_for_apis" {
  create_duration = "120s"

  depends_on = [
    google_project_service.firebase,
    google_project_service.firestore,
    google_project_service.firebaserules,
  ]
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = data.google_project.default.project_id

  depends_on = [time_sleep.wait_for_apis]
}

# ------------------------------------------------------------------
# 4. Register the web app
# ------------------------------------------------------------------
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = data.google_project.default.project_id
  display_name = var.project_name

  depends_on = [google_firebase_project.default]
}

# ------------------------------------------------------------------
# 5. Existing Firestore database in Europe (location is permanent!)
# ------------------------------------------------------------------
resource "google_firestore_database" "default" {
  provider    = google-beta
  project     = data.google_project.default.project_id
  name        = "(default)"
  location_id = "europe-north2"
  type        = "FIRESTORE_NATIVE"

  depends_on = [
    google_project_service.firestore,
    google_firebase_web_app.default
  ]
}

# ------------------------------------------------------------------
# 6. Publish Firestore security rules with Terraform
# ------------------------------------------------------------------
resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta
  project  = data.google_project.default.project_id

  source {
    files {
      name    = "firestore.rules"
      content = file("${path.module}/firestore.rules")
    }
  }

  depends_on = [
    google_project_service.firebaserules,
    google_firebase_project.default
  ]
}

resource "google_firebaserules_release" "firestore" {
  provider     = google-beta
  project      = data.google_project.default.project_id
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name

  lifecycle {
    replace_triggered_by = [
      google_firebaserules_ruleset.firestore
    ]
  }

  depends_on = [google_firestore_database.default]
}

# ------------------------------------------------------------------
# 7. Read the auto-generated web app config
# ------------------------------------------------------------------
data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  project    = data.google_project.default.project_id
  web_app_id = google_firebase_web_app.default.app_id
}

# ------------------------------------------------------------------
# 8. Write it as a JS module exporting the config object
# ------------------------------------------------------------------
resource "local_file" "firebase_config" {
  filename = "${path.module}/src/firebaseConfig.js"
  content = <<-EOT
    // Auto-generated by Terraform - do not edit manually
    export const firebaseConfig = ${jsonencode({
  apiKey            = data.google_firebase_web_app_config.default.api_key
  authDomain        = data.google_firebase_web_app_config.default.auth_domain
  projectId         = data.google_project.default.project_id
  storageBucket     = data.google_firebase_web_app_config.default.storage_bucket
  messagingSenderId = data.google_firebase_web_app_config.default.messaging_sender_id
  appId             = google_firebase_web_app.default.app_id
})};

    export default firebaseConfig;
  EOT
}

# ------------------------------------------------------------------
# Outputs
# ------------------------------------------------------------------
output "project_id" {
  description = "The existing GCP project ID managed by this configuration"
  value       = data.google_project.default.project_id
}

output "web_app_id" {
  value = google_firebase_web_app.default.app_id
}

output "firebase_config_file" {
  value = local_file.firebase_config.filename
}

output "firestore_location" {
  description = "Firestore database location (eur3 is the Europe multi-region)"
  value       = google_firestore_database.default.location_id
}