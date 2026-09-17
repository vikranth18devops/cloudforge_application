# 02 - Local App Development & Code Quality Guide

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Compiler-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Oxlint-Code_Quality-FF69B4?style=for-the-badge" />
</p>

## 📌 Step 2: Code Development, Linting & Compilation

Understand how the React SPA frontend (`src/`) and Node.js Express API backend (`server/`) work and compile for production.

---

## 💻 1️⃣ Local CLI Instructions

### 1. Install Dependencies
```bash
npm ci
```

### 2. Execute Code Quality Linter
```bash
npx oxlint
```

### 3. Build Production Bundle
```bash
npm run build
```

---

## ⚙️ 2️⃣ GitHub Actions Automated CI Integration (`.github/workflows/ci.yml`)

Executed in **Stage 1** and **Stage 3** of `.github/workflows/ci.yml`:

```yaml
# Stage 1: Oxlint Linter
- name: Run Code Quality Linter (Oxlint)
  run: npx oxlint

# Stage 3: Build Application
- name: Build Production Application Bundle
  run: npm run build
```

---

## 🔍 3️⃣ Verification Check
```bash
ls -la dist/
```
Verify `dist/index.html` static bundle exists cleanly.
