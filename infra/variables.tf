variable "aws_region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project Name"
  default     = "saas-starter"
}

variable "vpc_cidr" {
  description = "VPC CIDR Block"
  default     = "10.0.0.0/16"
}

variable "gemini_api_key" {
  description = "Gemini API Key"
  sensitive   = true
}

variable "linear_api_key" {
  description = "Linear API Key"
  sensitive   = true
}

variable "linear_team_id" {
  description = "Linear Team ID"
  sensitive   = true
}

variable "slack_webhook_url" {
  description = "Slack Webhook URL"
  sensitive   = true
}

variable "github_repo_url" {
  description = "GitHub Repository URL"
  # sensitive   = true
}
