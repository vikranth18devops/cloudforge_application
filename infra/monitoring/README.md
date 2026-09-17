# CloudForge Monitoring Setup (Prometheus & Grafana)

This directory contains production Kubernetes manifests and local Docker Compose files for monitoring CloudForge application metrics, CPU/memory usage, HTTP latency, and system health.

## Structure

```
infra/monitoring/
├── docker-compose.monitoring.yml   # Docker Compose for local monitoring stack
├── README.md                       # Setup guide
├── prometheus/
│   ├── prometheus-configmap.yaml   # Prometheus configuration & scrape targets
│   ├── prometheus-deployment.yaml  # Prometheus Deployment manifest
│   └── prometheus-service.yaml     # Prometheus ClusterIP Service (port 9090)
└── grafana/
    ├── grafana-datasource-configmap.yaml # Automated Prometheus datasource provisioning
    ├── grafana-dashboard-configmap.yaml  # Pre-configured Grafana dashboard JSON
    ├── grafana-deployment.yaml # Grafana Deployment manifest
    └── grafana-service.yaml    # Grafana Service (port 3000)
```

## Deployment Options

### Option 1: Deploy to Kubernetes Cluster (kubectl)

```bash
# 1. Create monitoring namespace
kubectl create namespace monitoring

# 2. Deploy Prometheus
kubectl apply -f infra/monitoring/prometheus/ -n monitoring

# 3. Deploy Grafana
kubectl apply -f infra/monitoring/grafana/ -n monitoring

# 4. Port forward Grafana to localhost:3000
kubectl port-forward svc/grafana-service 3000:3000 -n monitoring
```

- **Grafana Credentials**:
  - **URL**: `http://localhost:3000`
  - **User**: `admin`
  - **Password**: `CloudForgeAdmin2026!`

### Option 2: Run Locally via Docker Compose

```bash
docker compose -f infra/monitoring/docker-compose.monitoring.yml up -d
```
