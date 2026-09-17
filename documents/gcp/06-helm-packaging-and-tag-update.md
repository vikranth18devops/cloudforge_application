# 06 - Helm Packaging & Automated Values Tag Update Guide

<p align="left">
  <img src="https://img.shields.io/badge/Helm-v3-0F1689?style=for-the-badge&logo=helm&logoColor=white" />
  <img src="https://img.shields.io/badge/Git_Auto_Commit-GitOps-2088FF?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/ArgoCD-Sync_Trigger-EF6B48?style=for-the-badge&logo=argo&logoColor=white" />
</p>

## 📌 Step 6: Update Helm Values & Commit Tag to GitHub

After container image publishing succeeds, the pipeline updates `infra/helm/values.yaml` (`backend.image.tag`) with the published container image tag `${{ github.sha }}` and commits it back to GitHub. This commit triggers ArgoCD GitOps auto-sync.

---

## 💻 1️⃣ Manual CLI Instructions

```bash
# Update backend image tag in values.yaml
sed -i 's/tag: .*/tag: "v1.0.0"/' infra/helm/values.yaml

# Lint Helm Chart
helm lint ./infra/helm
```

---

## ⚙️ 2️⃣ GitHub Actions Automated Integration (`.github/workflows/ci.yml`)

Executed in **Stage 6** of `.github/workflows/ci.yml`:

```yaml
- name: Update Helm Chart Backend Image Tag
  run: |
    sed -i 's/tag: .*/tag: "${{ github.sha }}"/' infra/helm/values.yaml

- name: Commit & Push Updated Helm Values to GitHub
  uses: stefanzweifel/git-auto-commit-action@v5
  with:
    commit_message: "chore(gitops): update backend image tag to ${{ github.sha }} [skip ci]"
    file_pattern: 'infra/helm/values.yaml'
```

---

## 🔍 3️⃣ Verification Check
```bash
git log -n 1 --stat
```
Verify the latest commit contains changes to `infra/helm/values.yaml`.
