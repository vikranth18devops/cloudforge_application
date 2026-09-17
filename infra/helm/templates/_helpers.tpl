{{/*
Expand the name of the chart.
*/}}
{{- define "cloudforge.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a fully qualified app name.
*/}}
{{- define "cloudforge.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "cloudforge.labels" -}}
helm.sh/chart: {{ include "cloudforge.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "cloudforge.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Frontend Selector labels
*/}}
{{- define "cloudforge.frontend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cloudforge.name" . }}-frontend
app.kubernetes.io/instance: {{ .Release.Name }}
component: frontend
{{- end }}

{{/*
Backend Selector labels
*/}}
{{- define "cloudforge.backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cloudforge.name" . }}-backend
app.kubernetes.io/instance: {{ .Release.Name }}
component: backend
{{- end }}
