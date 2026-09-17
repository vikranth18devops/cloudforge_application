# 08 - Prometheus & Grafana Observability Monitoring Guide

<p align="left">
  <img src="https://img.shields.io/badge/Prometheus-Metrics-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" />
  <img src="https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana&logoColor=white" />
  <img src="https://img.shields.io/badge/Observability-Active-00C7B7?style=for-the-badge" />
</p>

## 📌 Step 8: Prometheus & Grafana Monitoring

Deploys Prometheus metrics scraper and Grafana dashboard visualization stack (`infra/monitoring/`) for real-time CPU, RAM, and HTTP latency tracking.

---

## 💻 1️⃣ Manual CLI Instructions

```bash
# 1. Deploy Prometheus & Grafana to Kubernetes
kubectl create namespace monitoring || true
kubectl apply -f infra/monitoring/prometheus/ -n monitoring
kubectl apply -f infra/monitoring/grafana/ -n monitoring

# 2. Access Grafana Dashboard via Port Forward
kubectl port-forward svc/grafana-service 3000:3000 -n monitoring
```
- **URL**: `http://localhost:3000`
- **User**: `admin`
- **Password**: `CloudForgeAdmin2026!`

---

## 🔍 2️⃣ Verification Check

```bash
kubectl get pods,svc -n monitoring
```
