# 05 - Docker Container Build & Google Artifact Registry Publish

<p align="left">
  <img src="https://img.shields.io/badge/Google_Artifact_Registry-GCP-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Container_Build-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Image_Tag-${{_github.sha_}}-2088FF?style=for-the-badge" />
</p>

## 📌 Step 5: Build & Push Container Image to GCP

Authenticates Docker to Google Artifact Registry, builds the Node.js API container image, and pushes tags (`${{ github.sha }}` and `latest`) to GCP.

---

## 💻 1️⃣ Manual CLI Instructions

```bash
gcloud auth configure-docker $GCP_REGION-docker.pkg.dev --quiet
export REPO_URI="$GCP_REGION-docker.pkg.dev/$GCP_PROJECT_ID/cloudforge-app-repo/backend"

docker build -t $REPO_URI:latest -t $REPO_URI:v1.0.0 ./server
docker push $REPO_URI:latest
docker push $REPO_URI:v1.0.0
```

---

## ⚙️ 2️⃣ GitHub Actions Automated Integration (`.github/workflows/ci.yml`)

Executed in **Stage 6** of `.github/workflows/ci.yml`:

```yaml
- name: Configure Docker Authentication for GCP
  run: gcloud auth configure-docker ${{ env.GCP_REGION }}-docker.pkg.dev --quiet

- name: Tag & Publish Container Image to GCP Container Repository
  run: |
    IMAGE_URI="${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/cloudforge-app-repo/backend:${{ github.sha }}"
    LATEST_URI="${{ env.GCP_REGION }}-docker.pkg.dev/${{ env.GCP_PROJECT_ID }}/cloudforge-app-repo/backend:latest"
    
    docker build -t $IMAGE_URI -t $LATEST_URI ./server
    docker push $IMAGE_URI
    docker push $LATEST_URI
```

---

## 🔍 3️⃣ Verification Check
```bash
gcloud artifacts docker images list $GCP_REGION-docker.pkg.dev/$GCP_PROJECT_ID/cloudforge-app-repo
```
