variable "project_id" {
  description = "ID of the existing Firebase/Google Cloud project"
  type        = string
  default     = "weebcult-81f89"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "Project ID must be 6-30 characters, start with a lowercase letter, end with a lowercase letter or digit, and contain only lowercase letters, digits, or hyphens."
  }
}

variable "project_name" {
  description = "Display name for the Firebase web app"
  type        = string
  default     = "WeebCult"
}