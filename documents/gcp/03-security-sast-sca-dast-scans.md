# 03 - DevSecOps Auditing (SAST, SCA, Trivy & OWASP ZAP DAST)

<p align="left">
  <img src="https://img.shields.io/badge/CodeQL-SAST-2088FF?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/NPM-SCA_Audit-CB3837?style=for-the-badge&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/Trivy-IaC_Container-00C7B7?style=for-the-badge&logo=aquasec&logoColor=white" />
  <img src="https://img.shields.io/badge/OWASP_ZAP-DAST_Scan-003A70?style=for-the-badge" />
</p>

## 📌 Step 3: Security Vulnerability Scanning

Audits third-party packages (SCA), source code (SAST), Terraform IaC files, Docker containers, and dynamic endpoints (DAST).

---

## 💻 1️⃣ Local CLI Instructions

```bash
# Dependency SCA Audit
npm audit --audit-level=high

# Trivy IaC Security Scan
trivy config infra/terraform/

# Trivy Local Container Scan
docker build -t cloudforge-backend:local ./server
trivy image cloudforge-backend:local

# OWASP ZAP DAST Preview Scan
npx vite preview --port 5173 &
docker run -t zaproxy/zap-stable zap-baseline.py -t http://localhost:5173/
```

---

## ⚙️ 2️⃣ GitHub Actions Automated Integration (`.github/workflows/ci.yml`)

Executed in **Stage 2** and **Stage 5** of `.github/workflows/ci.yml`:

```yaml
# Stage 2: CodeQL SAST & Trivy IaC
- name: Perform CodeQL SAST Analysis
  uses: github/codeql-action/analyze@v3

- name: Trivy IaC Security Scan
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'config'
    scan-ref: 'infra/terraform/'

# Stage 5: Container Scan & OWASP ZAP DAST
- name: Trivy Container Vulnerability Scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'cloudforge-backend:local'

- name: Run OWASP ZAP Baseline DAST Scan
  uses: zaproxy/action-baseline@v0.12.0
  with:
    target: 'http://localhost:5173/'
```

---

## 🔍 3️⃣ Verification Check
Check GitHub Security tab for uploaded SARIF vulnerability findings.
