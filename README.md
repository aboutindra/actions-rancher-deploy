# rancher-update

This action helps by updating a service in the Rancher 2 environment with kubernetes. 

# Examples

## Update service

```yaml
on:
push:
  branches:
  - master

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: sekassel-research/actions-rancher-update@v3.0.0
      with:
        rancher_url: https://rancher.test.de
        rancher_token: ${{ secrets.RANCHER_TOKEN }}
        cluster_id: ${{ secrets.CLUSTER_ID }}
        project_id: ${{ secrets.PROJECT_ID }}
        namespace: ${{ secrets.NAMESPACE }}
        deployment: ${{ secrets.DEPLOYMENT }}
        docker_image: sekassel-research/test-image:latest
        container_id: 0 # optional, defaults to 0
```

# Backwards compatibility

If you want to use this extension for `Rancher 1.6.x`, you need to use the following version `sekassel-research/actions-rancher-update@1.1.4`

## Example

```yaml
on:
  push:
    branches:
    - master

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: sekassel-research/actions-rancher-update@1.1.4
      with:
        rancher_url: https://rancher.test.de
        rancher_access: ${{ secrets.RANCHER_ACCESS }}
        rancher_key: ${{ secrets.RANCHER_KEY }}
        project_id: 1a5
        stack_name: test-stack
        service_name: test-service
        docker_image: sekassel-research/test-image:latest
```
