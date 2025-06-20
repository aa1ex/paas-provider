import { createConnectTransport } from '@connectrpc/connect-web'
import { createClient } from '@connectrpc/connect'
import {TemplateService} from "../gen/template/v1/template_pb";
import {VirtualMachineService} from "../gen/virtual_machine/v1/virtual_machine_pb";
import {KubernetesClusterService} from "../gen/kubernetes_cluster/v1/kubernetes_cluster_pb";

export const transport = createConnectTransport({
    baseUrl: 'http://localhost:8080',
})

export default {
    templates: createClient(TemplateService, transport),
    virtualMachines: createClient(VirtualMachineService, transport),
    kubernetesClusters: createClient(KubernetesClusterService, transport)
}