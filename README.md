# Multi-Tenant SaaS Starter with AI Features

A production-ready SaaS boilerplate featuring:
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (via RDS or container) - *To be finalized in infra*
- **Authentication**: AWS Cognito
- **Infrastructure**: Terraform (AWS ECS Fargate Spot, NAT Instance)
- **AI**: Gemini AI for autocomplete/summarization
- **CI/CD**: GitHub Actions -> AWS CodeBuild
- **Observability**: ELK Stack via CloudWatch

## Prerequisites

- [Docker](https://www.docker.com/)
- [Terraform](https://www.terraform.io/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate permissions.
- [Python 3.11+](https://www.python.org/)

## Project Structure

- `backend`: FastAPI application code.
- `infra`: Terraform infrastructure definitions.
- `scripts`: Helper scripts for deployment/maintenance.
- `.github`: CI/CD workflows.

## Setup

1. **Infrastructure**:
   ```bash
   cd infra
   terraform init
   terraform apply
   ```

2. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

## Cost Optimization
- **Fargate Spot**: Used for compute to reduce costs.
- **NAT Instance**: Replaces NAT Gateway for significant savings.
- **Cognito**: Leverages free tier (50k MAU).
