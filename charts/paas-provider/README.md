# PaaS Provider Helm Chart

This Helm chart deploys the PaaS Provider application on a Kubernetes cluster.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing the Chart

To install the chart with the release name `paas-provider`:

```bash
helm install paas-provider ./charts/paas-provider
```

## Configuration

The following table lists the configurable parameters of the PaaS Provider chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount.server` | Number of server replicas | `1` |
| `replicaCount.frontend` | Number of frontend replicas | `1` |
| `image.server.repository` | Server image repository | `paas-provider-server` |
| `image.server.tag` | Server image tag | `latest` |
| `image.server.pullPolicy` | Server image pull policy | `IfNotPresent` |
| `image.frontend.repository` | Frontend image repository | `paas-provider-frontend` |
| `image.frontend.tag` | Frontend image tag | `latest` |
| `image.frontend.pullPolicy` | Frontend image pull policy | `IfNotPresent` |
| `service.server.type` | Server service type | `ClusterIP` |
| `service.server.port` | Server service port | `8080` |
| `service.frontend.type` | Frontend service type | `ClusterIP` |
| `service.frontend.port` | Frontend service port | `80` |
| `ingress.enabled` | Enable ingress | `false` |
| `resources.server.limits.cpu` | Server CPU limit | `500m` |
| `resources.server.limits.memory` | Server memory limit | `512Mi` |
| `resources.server.requests.cpu` | Server CPU request | `100m` |
| `resources.server.requests.memory` | Server memory request | `128Mi` |
| `resources.frontend.limits.cpu` | Frontend CPU limit | `300m` |
| `resources.frontend.limits.memory` | Frontend memory limit | `256Mi` |
| `resources.frontend.requests.cpu` | Frontend CPU request | `100m` |
| `resources.frontend.requests.memory` | Frontend memory request | `128Mi` |

## Uninstalling the Chart

To uninstall/delete the `paas-provider` deployment:

```bash
helm uninstall paas-provider
```