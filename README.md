# School Management System ERP

This repository contains the full School Management System ERP package, divided into a frontend single-page application (SPA) and a backend REST API.

## Repository Structure

- **/backend**: Laravel 11 REST API. Manages database migrations, business logic, school roles (Super Admin, Admin, Principal, Teacher, Student, Parent, Accountant, HR), payroll, library issuances, hostel/transport tracking, and analytics.
- **/frontend**: React + Vite + Tailwind CSS + TypeScript Single Page Application. Features dashboards customized for each user role.

## Getting Started

Refer to the respective folders for setup and execution details:
1. **[Backend README](./backend/README.md)**: Setup instruction for PHP, Composer, and Laravel database configurations.
2. **[Frontend README](./frontend/README.md)**: Setup instruction for Node.js, npm, and Vite dev server.

## Production Deployment

Before pushing to GitHub or deploying in production, ensure that:
1. Environment-specific secrets in `.env` files are not pushed to public repositories.
2. The frontend API client is pointed to `https://subhraedu.com/api` (or configured via environment variables).
3. The steps in **[Deployment Guide](./deployment_guide.md)** are followed for GoDaddy shared hosting configurations.
