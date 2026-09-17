# 07 - ArgoCD GitOps Continuous Delivery & Cluster Sync

<p align="left">
  <img src="https://img.shields.io/badge/ArgoCD-GitOps-EF6B48?style=for-the-badge&logo=argo&logoColor=white" />
  <img src="https://img.shields.io/badge/Auto_Sync-Enabled-00C7B7?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Kubernetes-Deployment-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" />
</p>

## 📌 Step 7: ArgoCD GitOps Continuous Delivery

Deploys ArgoCD GitOps controller (`infra/argocd/`) targeting `infra/helm`. ArgoCD automatically detects new commit image tags in `infra/helm/values.yaml` and synchronizes the live Kubernetes deployment.

---

## 🔄 Automated GitOps Pipeline Flow

```
1. GitHub Actions commits updated image tag to infra/helm/values.yaml
   │
   ▼
2. ArgoCD Controller detects change in GitHub repo (infra/helm path)
   │
   ▼
3. ArgoCD Auto-Sync (Prune & Self-Heal) deploys updated container to Kubernetes!
```

---

## 💻 1️⃣ Manual Bootstrap CLI Instructions

```bash
# 1. Install ArgoCD Controller
kubectl create namespace argocd || true
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Apply CloudForge AppProject & Application Manifests
kubectl apply -f infra/argocd/appproject.yaml -n argocd
kubectl apply -f infra/argocd/application.yaml -n argocd
```

---

## 🔍 2️⃣ Verification & Sync Status

```bash
kubectl get application -n argocd
```
Verify `Healthy` and `Synced` status flags in ArgoCD.
