import type { Question, Category, IncidentScenario, MockInterviewSession, UserProfile, AnalyticsEvent, SearchQueryLog } from '../types';

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'aws-ec2-001',
    cloud: 'AWS',
    category: 'Compute',
    subcategory: 'EC2',
    title: 'What is the fundamental difference between an AWS EC2 Instance and an AMI?',
    previewAnswer: 'An AMI (Amazon Machine Image) is a stateless template containing the OS, software, and configuration required to launch a virtual server. An EC2 instance is the live, running virtual machine created from that AMI template.',
    fullAnswer: `An **Amazon Machine Image (AMI)** is an immutable blueprint containing:
1. An EBS snapshot or root volume template (Operating System, installed packages, applications).
2. Block device mapping configuration (specifying volume attachments).
3. Launch permissions determining which AWS accounts can launch instances from it.

An **EC2 Instance** is the operational virtual machine running in AWS hardware:
- Consumes CPU, RAM, and ENI (Network Interfaces).
- Has instance lifecycle states: *Pending, Running, Stopping, Stopped, Terminated*.
- Can be modified independently of the parent AMI (e.g. installing new patches).

### Architectural Analogy
- **AMI** = Class definition in Object-Oriented Programming or Docker Image.
- **EC2 Instance** = Instantiated Object running in memory or Docker Container.`,
    realWorldExample: 'In automated CI/CD deployment pipelines (e.g., Packer + Terraform), engineers bake an immutable AMI with pre-installed application code and security patches, then trigger an AWS Auto Scaling Group refresh to launch new EC2 instances without needing runtime setup scripts.',
    architectureDiagram: `┌────────────────────────────────────────┐
│             PACKER / BUILD             │
│   OS + App Code + Security Hardening   │
└───────────────────┬────────────────────┘
                    │ Bakes
                    ▼
          ┌───────────────────┐
          │     AWS AMI       │
          │  (AMI-0a1b2c3d)   │
          └─────────┬─────────┘
                    │ Launches
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌───────┐       ┌───────┐       ┌───────┐
│ EC2 A │       │ EC2 B │       │ EC2 C │
│(Exec) │       │(Exec) │       │(Exec) │
└───────┘       └───────┘       └───────┘`,
    commonMistakes: [
      'Assuming updating files inside a running EC2 automatically updates the original AMI.',
      'Confusing EC2 Instance Store volumes (ephemeral data lost on stop) with persistent EBS volumes.',
      'Forgetting that AMIs are region-bound and must be explicitly copied to target regions before multi-region deployment.'
    ],
    followUpQuestions: [
      {
        id: 'fu-1',
        question: 'What happens to data on an EC2 instance store volume when you stop vs restart the instance?',
        expectedAnswerHint: 'Instance store data is erased permanently when stopped/deallocated, but persists across soft OS reboots.'
      },
      {
        id: 'fu-2',
        question: 'How do you perform zero-downtime AMI rolling updates in an Auto Scaling Group?',
        expectedAnswerHint: 'Use AWS Instance Refresh with minimum healthy percentage parameters or Blue/Green ASG swap.'
      }
    ],
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    isLocked: true,
    viewsCount: 18420,
    bookmarksCount: 2420,
    sharesCount: 843,
    signupsConverted: 612,
    seoTitle: 'AWS EC2 vs AMI Interview Questions & Architectural Answers',
    seoMetaDescription: 'Detailed explanation and architectural diagram explaining EC2 vs AMI for AWS DevOps interviews.',
    publishedAt: '2026-08-15',
    status: 'Published'
  },
  {
    id: 'aws-iam-002',
    cloud: 'AWS',
    category: 'Security',
    subcategory: 'IAM',
    title: 'How does AWS IAM evaluate authorization policies when multiple allow/deny statements overlap?',
    previewAnswer: 'AWS IAM evaluates authorization using explicit deny priority. By default all requests are denied. An explicit ALLOW grants permission unless there is an explicit DENY, which overrides any allow.',
    fullAnswer: `AWS IAM policy evaluation follows a deterministic decision matrix algorithm:

1. **Default Deny:** By default, all requests are implicitly denied.
2. **Explicit Deny Check:** If any applicable policy statement (Identity-based, Resource-based, Permission Boundary, SCP) contains an explicit \`"Effect": "Deny"\`, the decision immediately resolves to **DENY**.
3. **Explicit Allow Check:** If no explicit deny exists, the evaluator looks for at least one applicable \`"Effect": "Allow"\`. If found, access is **ALLOWED**.
4. **Final Decision:** If no explicit allow exists, access remains **DENIED**.

### Organization Guardrails (SCPs)
Service Control Policies (SCPs) set the maximum permissions for account members in AWS Organizations. Even if an IAM user has \`AdministratorAccess\` (\`*:*\`), an SCP \`Deny\` rule on \`s3:DeleteBucket\` will override and block the administrator!`,
    realWorldExample: 'A developer account has an IAM user policy allowing `s3:*`. However, an AWS Organization SCP explicitly denies `s3:DeleteBucket` across all dev accounts to prevent accidental data destruction. When the developer runs `aws s3 rb s3://my-bucket`, IAM evaluates explicit DENY first and returns an AccessDenied error.',
    architectureDiagram: `Request Received
       │
       ▼
Explicit DENY statement exists?
   ├── YES ──► [ DENIED ❌ ]
   └── NO
       │
       ▼
Explicit ALLOW statement exists?
   ├── YES ──► [ ALLOWED ✅ ]
   └── NO  ──► [ DENIED ❌ ]`,
    commonMistakes: [
      'Believing an Allow statement overrides a Deny statement in IAM.',
      'Confusing IAM Roles (temporary credentials via STS) with IAM Users (permanent credentials).',
      'Forgetting that S3 bucket policies and KMS key policies interact with IAM identity policies.'
    ],
    followUpQuestions: [
      {
        id: 'fu-3',
        question: 'What is the difference between an IAM Permission Boundary and a Resource-based policy?',
        expectedAnswerHint: 'Permission Boundaries set maximum allowable permissions on an identity, whereas Resource policies attach directly to resources like S3/SQS.'
      }
    ],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: true,
    viewsCount: 24190,
    bookmarksCount: 3890,
    sharesCount: 1240,
    signupsConverted: 890,
    seoTitle: 'AWS IAM Policy Evaluation Logic Explained for Senior Cloud Engineers',
    seoMetaDescription: 'Learn AWS IAM policy evaluation order, SCP boundaries, and explicit deny precedence.',
    publishedAt: '2026-08-18',
    status: 'Published'
  },
  {
    id: 'aws-vpc-006',
    cloud: 'AWS',
    category: 'Amazon Web Services',
    subcategory: 'Networking & VPC',
    title: 'What is the architectural difference between AWS VPC Peering and AWS Transit Gateway?',
    previewAnswer: 'VPC Peering connects two VPCs in a non-transitive 1-to-1 relationship. AWS Transit Gateway acts as a central hub for routing hundreds of VPCs, VPNs, and Direct Connects.',
    fullAnswer: `### AWS VPC Peering vs AWS Transit Gateway (TGW)

**VPC Peering:**
- Point-to-point Layer-3 connection between 2 VPCs.
- Non-transitive routing (VPC A -> VPC B -> VPC C does NOT allow VPC A to reach VPC C).
- N*(N-1)/2 connections required for full mesh networking (complex at scale).
- Zero additional gateway cost or throughput bottle-necking.

**AWS Transit Gateway (TGW):**
- Regional hub-and-spoke router connecting thousands of VPCs and on-premises networks.
- Supports transitive routing and central firewall inspection VPCs.
- Simplifies multi-account architecture in AWS Organizations.`,
    realWorldExample: 'An enterprise managing 50 AWS accounts uses Transit Gateway to route traffic through a centralized Security Inspection VPC containing Palo Alto firewall appliances before traffic reaches internal workloads.',
    architectureDiagram: `┌────────┐       ┌────────┐
│ VPC A  │ ────► │ VPC B  │ (VPC Peering: Non-transitive 1-to-1)
└────────┘       └────────┘

 ┌───────┐   ┌───────┐   ┌───────┐
 │ VPC A │   │ VPC B │   │ VPC C │
 └───┬───┘   └───┬───┘   └───┬───┘
     │           │           │
     └───► [ TRANSIT GW ] ◄──┘ (Hub & Spoke Router)`,
    commonMistakes: [
      'Assuming VPC Peering allows transitive traffic routing by default.',
      'Overlooking AWS Transit Gateway data processing hourly costs in high-throughput environments.'
    ],
    followUpQuestions: [
      {
        id: 'fu-vpc-1',
        question: 'How do you handle overlapping CIDR blocks in VPC Peering?',
        expectedAnswerHint: 'Overlapping CIDR blocks cannot be peered; you must use Private NAT Gateways or AWS PrivateLink.'
      }
    ],
    difficulty: 'Intermediate',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 19800,
    bookmarksCount: 3120,
    sharesCount: 950,
    signupsConverted: 430,
    seoTitle: 'AWS VPC Peering vs Transit Gateway Architecture Guide',
    seoMetaDescription: 'Detailed technical comparison of VPC Peering vs AWS Transit Gateway for DevOps interviews.',
    publishedAt: '2026-08-22',
    status: 'Published'
  },
  {
    id: 'aws-s3-007',
    cloud: 'AWS',
    category: 'Amazon Web Services',
    subcategory: 'Storage & S3',
    title: 'How do AWS S3 Bucket Policies, IAM Policies, and KMS Key Policies interact to secure data?',
    previewAnswer: 'S3 access requires explicit authorization from both IAM identity policies and S3 bucket policies. If KMS SSE-KMS encryption is enabled, the caller must also have kms:Decrypt permissions.',
    fullAnswer: `### Triad S3 Authorization Evaluation Logic

To read an encrypted object from AWS S3, IAM evaluates:
1. **IAM Identity Policy:** User or Role must have \`s3:GetObject\` permission.
2. **S3 Bucket Policy / ACL:** Bucket must not contain an explicit \`Deny\` statement blocking the principal.
3. **KMS Key Policy:** If encrypted with SSE-KMS, key policy or IAM policy must grant \`kms:Decrypt\` on the KMS key.

### Common Denial Causes
Even if an IAM User has \`AdministratorAccess\`, if the KMS Key Policy does not explicitly trust the IAM user or root account, S3 returns Access Denied!`,
    realWorldExample: 'A cross-account analytics team attempts to copy S3 objects from Account A to Account B. S3 bucket policy allows Account B, but KMS Key policy in Account A was missing `kms:GenerateDataKey` for Account B role, causing silent pipeline failure.',
    architectureDiagram: `IAM Role ──► [ IAM Policy Check ] ──► [ S3 Bucket Policy Check ] ──► [ KMS Decrypt Check ] ──► Object Access`,
    commonMistakes: [
      'Assuming S3 bucket policy alone is sufficient without verifying KMS key policy permissions.',
      'Forgetting that S3 Block Public Access overrides public bucket policies.'
    ],
    followUpQuestions: [],
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    isLocked: false,
    viewsCount: 15400,
    bookmarksCount: 2100,
    sharesCount: 620,
    signupsConverted: 310,
    seoTitle: 'AWS S3 Security, KMS Encryption & Bucket Policy Intersect',
    seoMetaDescription: 'Master AWS S3 bucket policies, IAM evaluation, and KMS encryption key policies.',
    publishedAt: '2026-08-25',
    status: 'Published'
  },
  {
    id: 'aws-eks-008',
    cloud: 'AWS',
    category: 'Amazon Web Services',
    subcategory: 'EKS & Compute',
    title: 'How does IAM Roles for Service Accounts (IRSA) work in Amazon EKS?',
    previewAnswer: 'IRSA leverages an OpenID Connect (OIDC) identity provider for the EKS cluster to exchange Kubernetes service account tokens for short-lived AWS STS IAM credentials.',
    fullAnswer: `### IRSA (IAM Roles for Service Accounts) Mechanism

Instead of assigning IAM permissions to worker node EC2 instances (which exposes credentials to all pods on that node), IRSA enforces least privilege per pod:

1. EKS cluster acts as an **OIDC Identity Provider**.
2. Pod definition references a **Kubernetes ServiceAccount** annotated with an IAM Role ARN (\`eks.amazonaws.com/role-arn\`).
3. EKS mutating webhook injects an OIDC JWT token into the pod volume (\`/var/run/secrets/kubernetes.io/serviceaccount/token\`).
4. AWS SDK inside the pod calls \`sts:AssumeRoleWithWebIdentity\`, swapping the OIDC token for temporary AWS credentials!`,
    realWorldExample: 'In an EKS cluster, an App Pod needs access to S3 while a Monitoring Pod needs access to CloudWatch. IRSA ensures App Pod cannot read CloudWatch metrics and Monitoring Pod cannot access S3.',
    architectureDiagram: `Pod (ServiceAccount) ──► Mutating Webhook (Token Injected) ──► AWS STS (AssumeRoleWithWebIdentity) ──► Temporary IAM Credentials`,
    commonMistakes: [
      'Attaching S3/RDS IAM policies directly to worker node EC2 roles instead of using IRSA.',
      'Forgetting to configure OIDC trust relationship conditions in the IAM Role.'
    ],
    followUpQuestions: [],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 22100,
    bookmarksCount: 3450,
    sharesCount: 1120,
    signupsConverted: 540,
    seoTitle: 'AWS EKS IRSA & OIDC Identity Architecture Guide',
    seoMetaDescription: 'Detailed explanation of IAM Roles for Service Accounts (IRSA) in Amazon EKS.',
    publishedAt: '2026-08-28',
    status: 'Published'
  },
  {
    id: 'aws-lambda-009',
    cloud: 'AWS',
    category: 'Amazon Web Services',
    subcategory: 'Serverless & Compute',
    title: 'How do you mitigate AWS Lambda cold starts in latency-critical microservices?',
    previewAnswer: 'Mitigate cold starts using Provisioned Concurrency to keep execution environments warm, optimize deployment package size, and initialize SDK clients outside the function handler.',
    fullAnswer: `### AWS Lambda Lifecycle & Cold Starts

When a Lambda function is invoked after inactivity:
1. **Download Code/Container Image:** Downloads function package.
2. **Initialize Runtime:** Boots runtime (Node.js, Python, Java JVM).
3. **Execute Static Code:** Runs code outside the \`exports.handler\` function.

### Optimization Strategies:
- **Provisioned Concurrency:** Pre-warms requested number of execution environments ready to respond instantly (<10ms).
- **Static Code Initialization:** Create DB connection pools and AWS SDK clients outside the handler function so they persist across invocations.
- **VPC ENI Optimization:** AWS Hyperplane ENI re-uses existing network interfaces without cold-start delay.`,
    realWorldExample: 'A payment gateway service on AWS Lambda uses Provisioned Concurrency set to 50 during peak morning hours, maintaining sub-50ms API response SLA.',
    architectureDiagram: `Request ──► Warm Lambda Instance (<10ms Execution)
Request ──► Cold Start (Provisioning Runtime ~500ms - 2s)`,
    commonMistakes: [
      'Creating new database connection pools inside the handler function on every invocation.',
      'Using heavyweight frameworks with massive initialization overhead in serverless functions.'
    ],
    followUpQuestions: [],
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    isLocked: false,
    viewsCount: 17600,
    bookmarksCount: 2540,
    sharesCount: 890,
    signupsConverted: 410,
    seoTitle: 'AWS Lambda Cold Start Optimization & Provisioned Concurrency',
    seoMetaDescription: 'How to reduce AWS Lambda cold start latency for production microservices.',
    publishedAt: '2026-09-01',
    status: 'Published'
  },
  {
    id: 'aws-rds-010',
    cloud: 'AWS',
    category: 'Amazon Web Services',
    subcategory: 'Database & RDS',
    title: 'What is the architectural difference between AWS RDS Multi-AZ Failover and Read Replicas?',
    previewAnswer: 'Multi-AZ provides synchronous replication across Availability Zones for High Availability and disaster recovery. Read Replicas provide asynchronous replication for read scaling.',
    fullAnswer: `### RDS Multi-AZ Deployment vs Read Replicas

**RDS Multi-AZ (High Availability):**
- **Replication Type:** Synchronous block-level replication to standby DB in another AZ.
- **Failover:** Automatic CNAME failover (~60-120 seconds) if primary instance fails.
- **Use Case:** High availability, automated backup snapshots, disaster recovery.
- **Read Workloads:** Standby DB is NOT accessible for read queries.

**RDS Read Replicas (Read Scalability):**
- **Replication Type:** Asynchronous engine-native replication (MySQL binlog/PostgreSQL WAL).
- **Use Case:** Scaling read-heavy application traffic across multiple endpoints.
- **Accessibility:** Active read-only database endpoints.`,
    realWorldExample: 'An e-commerce site uses RDS PostgreSQL Multi-AZ for ACID compliant checkout transactions, and provisions 3 Read Replicas for reporting dashboards and product catalogue queries.',
    architectureDiagram: `Primary DB (AZ-a) ──(Sync Block Rep)──► Standby DB (AZ-b) [Multi-AZ HA]
Primary DB (AZ-a) ──(Async WAL Rep)──► Read Replica 1 [Read Scalability]`,
    commonMistakes: [
      'Attempting to run SELECT queries directly against the RDS Multi-AZ standby instance.',
      'Assuming Read Replicas provide automatic DNS failover without manual promotion.'
    ],
    followUpQuestions: [],
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    isLocked: false,
    viewsCount: 21300,
    bookmarksCount: 3200,
    sharesCount: 1040,
    signupsConverted: 510,
    seoTitle: 'AWS RDS Multi-AZ vs Read Replicas Architectural Comparison',
    seoMetaDescription: 'Detailed AWS RDS Multi-AZ synchronous failover vs asynchronous Read Replicas.',
    publishedAt: '2026-09-05',
    status: 'Published'
  },
  {
    id: 'k8s-net-003',
    cloud: 'Kubernetes',
    category: 'Networking',
    subcategory: 'Ingress & CNI',
    title: 'How does Kubernetes handle Pod-to-Pod communication across different nodes without NAT?',
    previewAnswer: 'Kubernetes mandates a flat IP-per-pod network model. CNI plugins (like Calico, Cilium, or AWS VPC CNI) establish overlay tunnels (VXLAN/Geneve) or direct routing tables so pods communicate natively across nodes without NAT.',
    fullAnswer: `The **Kubernetes Networking Model** requires three fundamental invariants:
1. All pods can communicate with all other pods on any node without using Network Address Translation (NAT).
2. Agents on a node (e.g. Kubelet) can communicate with all pods on that node.
3. The IP that a pod sees as its own IP is the exact same IP that all other pods see it as.

### How CNI Plugins Implement This:
- **Overlay Networks (e.g., Flannel, Calico VXLAN):** Encapsulate Layer-2 pod packets inside Layer-3 UDP packets transmitted between worker node IPs.
- **Direct Routing (e.g., Cilium eBPF, AWS VPC CNI):** Assign real VPC subnet IPs directly to Pod ENIs or configure BGP routing tables on top-of-rack switches, removing encapsulation overhead completely!`,
    realWorldExample: 'In Amazon EKS using AWS VPC CNI (`aws-k8s-cni`), pods receive secondary IPv4 addresses directly from the node AWS VPC Subnet. Pods communicate across EC2 nodes using native AWS VPC routing, achieving wire-speed network performance without VXLAN tunnel overhead.',
    architectureDiagram: `┌─────────────────────────┐         ┌─────────────────────────┐
│       NODE A (EC2)      │         │       NODE B (EC2)      │
│ ┌─────────────────────┐ │         │ ┌─────────────────────┐ │
│ │ Pod A (10.0.1.15)   │ │  CNI    │ │ Pod B (10.0.2.22)   │ │
│ └──────────┬──────────┘ │ Direct  │ └──────────▲──────────┘ │
│            │ Direct IP  │ Router  │            │ Direct IP  │
│            ▼            ├─────────┼────────────┘            │
│       eth0 (Node A)     │ Wire    │       eth0 (Node B)     │
└─────────────────────────┘ Speed   └─────────────────────────┘`,
    commonMistakes: [
      'Assuming Pod IPs are permanent (Pod IPs are ephemeral and change upon Pod restart).',
      'Confusing ClusterIP service virtual IPs (iptables/IPVS rules) with actual Pod network interfaces.',
      'Overlooking VPC IP address exhaustion when deploying AWS VPC CNI in small subnets.'
    ],
    followUpQuestions: [
      {
        id: 'fu-4',
        question: 'What is the role of Kube-Proxy in Kubernetes networking?',
        expectedAnswerHint: 'Kube-proxy watches the API server and maintains iptables, IPVS, or eBPF rules to map virtual Service ClusterIPs to Pod endpoints.'
      }
    ],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: true,
    viewsCount: 31200,
    bookmarksCount: 4510,
    sharesCount: 2150,
    signupsConverted: 1420,
    seoTitle: 'Kubernetes Pod Networking & CNI Architecture Deep Dive',
    seoMetaDescription: 'Understand K8s pod communication, CNI plugins, overlay networks vs VPC native routing.',
    publishedAt: '2026-08-20',
    status: 'Published'
  },
  {
    id: 'tf-state-004',
    cloud: 'Terraform',
    category: 'Infrastructure as Code',
    subcategory: 'State Management',
    title: 'How do you prevent state lock contention and security leaks in remote Terraform state files?',
    previewAnswer: 'Use remote backends like AWS S3 + DynamoDB (or Terraform Cloud/S3 native locking) for state locking, enable KMS encryption at rest, enable versioning, and strictly restrict IAM backend permissions.',
    fullAnswer: `Terraform state mapping real-world cloud resources to HCL declarations must be managed safely in team environments:

### 1. Concurrency & State Locking
When running \`terraform apply\`, Terraform writes a lock ID to a locking mechanism (e.g., DynamoDB table key \`LockID\`). If another engineer or CI pipeline executes concurrently, Terraform aborts execution with a \`State Locked\` error, preventing state file corruption.

### 2. Security & Secrets Management
Terraform state contains sensitive values in plaintext (e.g. database passwords, private keys). Security measures include:
- **Server-Side Encryption:** KMS customer managed keys (CMK) on S3 buckets.
- **TLS Transport Encryption:** Force HTTPS bucket policy enforcement.
- **IAM RBAC Control:** Restrict \`s3:GetObject\` access to dedicated CI/CD execution roles.
- **External Secret Managers:** Store secrets in AWS Secrets Manager or HashiCorp Vault instead of inline hardcoded variables.`,
    realWorldExample: 'In an enterprise GitHub Actions workflow, Terraform uses an S3 backend with DynamoDB locking. If two pull requests attempt to merge simultaneously, the second pipeline detects the DynamoDB state lock held by the first pipeline and safely waits or fails cleanly.',
    architectureDiagram: `┌────────────────────────────────────────────────────────┐
│                   GITHUB ACTIONS CI                     │
└───────────────┬────────────────────────┬───────────────┘
                │ 1. Acquire Lock        │ 2. Read/Write State
                ▼                        ▼
     ┌────────────────────┐   ┌────────────────────┐
     │  AWS DYNAMODB      │   │  AWS S3 BACKEND    │
     │  (State Locking)   │   │ (KMS Encrypted)    │
     └────────────────────┘   └────────────────────┘`,
    commonMistakes: [
      'Storing state files in git repositories (exposes secrets and causes merge conflicts).',
      'Forgetting S3 bucket versioning (prevents recovery from corrupted state files).',
      'Not using DynamoDB or backend locking in multi-developer environments.'
    ],
    followUpQuestions: [
      {
        id: 'fu-5',
        question: 'What command do you use to force unlock a stuck Terraform state lock?',
        expectedAnswerHint: '`terraform force-unlock <LOCK-ID>` after verifying no active pipeline is executing.'
      }
    ],
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    isLocked: true,
    viewsCount: 15400,
    bookmarksCount: 2100,
    sharesCount: 780,
    signupsConverted: 490,
    seoTitle: 'Terraform State Management, Locking & Security Best Practices',
    seoMetaDescription: 'Learn how to secure Terraform remote state with S3, KMS encryption, and DynamoDB locking.',
    publishedAt: '2026-08-22',
    status: 'Published'
  },
  {
    id: 'az-aks-005',
    cloud: 'Azure',
    category: 'Containers',
    subcategory: 'AKS',
    title: 'What is Azure CNI vs Kubenet in Azure Kubernetes Service (AKS)?',
    previewAnswer: 'Kubenet assigns Pod IPs from a virtual isolated overlay subnet and uses NAT for VNet communication. Azure CNI assigns real Azure VNet IP addresses directly to every Pod.',
    fullAnswer: `Choosing the right network plugin for Azure Kubernetes Service (AKS):

### Kubenet (Basic Networking)
- Pods reside in a separate virtual network overlay.
- Requires Node NAT (Network Address Translation) to communicate with Azure VNet resources.
- **Pros:** Conserves VNet IP addresses (great for small VNet ranges).
- **Cons:** Extra latency overhead due to NAT; Pods cannot be directly reached from outside the cluster without Ingress/LoadBalancer.

### Azure CNI (Advanced Networking)
- Every Pod gets a real, dedicated IP address directly from the Azure VNet subnet.
- **Pros:** Native VNet performance; direct connection to Azure ExpressRoute, VPN, and peered VNets without NAT.
- **Cons:** Requires large VNet IP pools up-front (Node max pods × node count).`,
    realWorldExample: 'An enterprise bank connecting AKS to on-premises databases over Azure ExpressRoute uses Azure CNI so on-prem security firewalls can inspect and route directly to individual Kubernetes Pod IPs.',
    architectureDiagram: `Kubenet:     [Pod (Overlay)] ──► NAT ──► [Azure VNet Node] ──► Subnet
Azure CNI:   [Pod (VNet IP)] ───────────► [Azure VNet Subnet] Direct!`,
    commonMistakes: [
      'Underestimating subnet size when deploying Azure CNI, causing node provisioning failures.',
      'Assuming Azure CNI can be changed to Kubenet post-cluster creation without recreation.'
    ],
    followUpQuestions: [],
    difficulty: 'Intermediate',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 12800,
    bookmarksCount: 1650,
    sharesCount: 520,
    signupsConverted: 340,
    seoTitle: 'Azure AKS Kubenet vs Azure CNI Networking Comparison',
    seoMetaDescription: 'Compare Azure CNI and Kubenet for AKS cluster architecture and VNet IP planning.',
    publishedAt: '2026-08-25',
    status: 'Published'
  },
  {
    id: 'finops-cost-006',
    cloud: 'FinOps',
    category: 'Cost Optimization',
    subcategory: 'Cloud Financial Management',
    title: 'How do you design a cost optimization strategy for idle EC2/RDS resources and unattached EBS volumes?',
    previewAnswer: 'Implement automated tagging guardrails, leverage AWS Compute Savings Plans / Reserved Instances, automate automated night/weekend shutdown for non-prod environments, and enforce automated cleanup for unattached EBS volumes.',
    fullAnswer: `A production FinOps cost reduction strategy follows a 3-phase lifecycle: **Inform, Optimize, Operate**.

### 1. Identification & Automation
- **Unattached EBS Volumes:** Write AWS EventBridge + Lambda or Custodian rules to identify volumes in \`available\` state for > 7 days, snapshot them, and delete.
- **Idle EC2/RDS Instances:** Monitor CloudWatch \`CPUUtilization < 5%\` over 14 days. Auto-stop non-production environments outside business hours using AWS Instance Scheduler.

### 2. Commitment Discount Optimization
- Calculate baseline 24/7 compute usage and apply **AWS Savings Plans** (up to 72% discount) or **Azure Reservations**.
- Use **Spot Instances** for stateless Kubernetes node pools with auto-scaler fallback to On-Demand.`,
    realWorldExample: 'Implementing AWS Cost Anomaly Detection coupled with auto-stopping staging EKS clusters at 8 PM saved a fintech customer \$34,000/month on cloud infrastructure spend while improving carbon footprint awareness.',
    architectureDiagram: `AWS Cost Explorer ──► AWS Lambda ──► Slack Alert ──► Auto Cleanup`,
    commonMistakes: [
      'Deleting unattached EBS volumes without creating a mandatory final snapshot.',
      'Purchasing 3-year upfront Reserved Instances for volatile application workloads.'
    ],
    followUpQuestions: [],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 19800,
    bookmarksCount: 2900,
    sharesCount: 1100,
    signupsConverted: 710,
    seoTitle: 'FinOps Cloud Cost Optimization Strategy & Automation Guide',
    seoMetaDescription: 'Learn FinOps techniques for reducing AWS/Azure/GCP cloud spend by up to 40%.',
    publishedAt: '2026-08-28',
    status: 'Published'
  },
  {
    id: 'docker-cmd-007',
    cloud: 'Docker',
    category: 'Containerization',
    subcategory: 'Dockerfile & Multi-Stage',
    title: 'What is the difference between CMD and ENTRYPOINT in Docker, and how do multi-stage builds reduce image size?',
    previewAnswer: 'ENTRYPOINT sets the default executable for the container, while CMD sets default arguments that can be overridden at runtime. Multi-stage builds separate compile dependencies from final minimal runtime stages (e.g. Alpine/Distroless).',
    fullAnswer: `### ENTRYPOINT vs CMD
- **ENTRYPOINT:** Defines the binary command executed when the container starts (e.g. \`ENTRYPOINT ["python3", "app.py"]\`). Cannot be easily overridden without \`--entrypoint\`.
- **CMD:** Appends default arguments to ENTRYPOINT or provides a default command if no ENTRYPOINT is set. Overridden by passing arguments at \`docker run\`.

### Multi-Stage Build Pattern
\`\`\`dockerfile
# Stage 1: Build stage with heavy SDK compilers
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

# Stage 2: Minimal Distroless runtime image (10MB vs 800MB)
FROM gcr.io/distroless/static
COPY --from=builder /app/main /
ENTRYPOINT ["/main"]
\`\`\``,
    realWorldExample: 'Using Go multi-stage builds reduced container image size from 850MB to 12MB, speeding up EKS container pull times during auto-scaling events from 45 seconds to 1.8 seconds.',
    architectureDiagram: `[ Heavy Go SDK Builder Stage (850MB) ] ──► Copy Binary ──► [ Minimal Distroless Runtime (12MB) ]`,
    commonMistakes: [
      'Using shell form (ENTRYPOINT python app.py) which wraps execution in /bin/sh -c and breaks SIGTERM signal handling.',
      'Including build tools (npm, maven, gcc) in final production docker images.'
    ],
    followUpQuestions: [],
    difficulty: 'Intermediate',
    targetExperience: '1-2 Years',
    isLocked: false,
    viewsCount: 28400,
    bookmarksCount: 3910,
    sharesCount: 1420,
    signupsConverted: 890,
    publishedAt: '2026-09-01',
    status: 'Published'
  },
  {
    id: 'helm-chart-008',
    cloud: 'Helm',
    category: 'Package Management',
    subcategory: 'Templating & Hooks',
    title: 'How do Helm Chart Release Hooks work, and how do you handle rollback when a pre-install database migration fails?',
    previewAnswer: 'Helm hooks allow executing custom logic (such as DB migrations or secret generation) at specific points in a release lifecycle (e.g. pre-install, post-upgrade). Failed hooks block release rollout and trigger automatic rollback policies.',
    fullAnswer: `### Helm Lifecycle Hooks
Helm allows annotating Kubernetes Job manifests with release lifecycle annotations:
\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate-job
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
\`\`\`

If a \`pre-upgrade\` migration job fails, Helm aborts the release deployment before modifying the live deployment pods, preventing application crashes against mismatched database schemas.`,
    realWorldExample: 'In automated GitOps pipelines, Helm pre-upgrade hooks execute Alembic DB migrations. If a schema lock timeout occurs, Helm halts rollout and preserves existing stable pods.',
    architectureDiagram: `Helm Upgrade Trigger ──► Pre-Upgrade Hook Job ──► [ Success ✅ ] ──► Update Deployment`,
    commonMistakes: [
      'Forgetting to configure helm.sh/hook-delete-policy leading to duplicate migration job name conflicts on subsequent releases.'
    ],
    followUpQuestions: [],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 19400,
    bookmarksCount: 2810,
    sharesCount: 950,
    signupsConverted: 640,
    publishedAt: '2026-09-03',
    status: 'Published'
  },
  {
    id: 'argocd-gitops-009',
    cloud: 'ArgoCD',
    category: 'GitOps & CI/CD',
    subcategory: 'Declarative Sync',
    title: 'How does ArgoCD detect GitOps configuration drift, and how do Self-Healing and Automated Sync policies operate?',
    previewAnswer: 'ArgoCD continuously compares live Kubernetes cluster state against desired manifests in Git repositories. Upon drift detection, ArgoCD marks the Application as OutOfSync and triggers automated sync and self-healing to force cluster convergence.',
    fullAnswer: `### ArgoCD Sync Mechanisms
- **Out-of-Sync Detection:** ArgoCD controller reconciles live cluster resources against Git target manifests every 3 minutes (or instantly via Git webhooks).
- **Self-Healing (\`selfHeal: true\`):** If a cluster administrator manually edits a Service or Deployment via \`kubectl edit\`, ArgoCD immediately overwrites manual drift to match Git.
- **Prune (\`prune: true\`):** Automatically deletes cluster resources when their YAML manifests are removed from the Git repository.`,
    realWorldExample: 'A rogue manual change to an EKS Ingress annotation broke TLS termination. ArgoCD self-healing detected drift within 2 seconds and restored the original Git configuration automatically.',
    architectureDiagram: `Git Repo (Desired State) ◄── ArgoCD Controller (Reconcile Loop) ──► EKS Cluster (Live State)`,
    commonMistakes: [
      'Not ignoring dynamic fields like HPA replica counts or status fields in ArgoCD ignoreDifferences spec.'
    ],
    followUpQuestions: [],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 31200,
    bookmarksCount: 4890,
    sharesCount: 1840,
    signupsConverted: 1120,
    publishedAt: '2026-09-05',
    status: 'Published'
  },
  {
    id: 'jenkins-pipe-010',
    cloud: 'Jenkins',
    category: 'CI/CD Automation',
    subcategory: 'Pipeline & Kubernetes Pod Agents',
    title: 'How do you design scalable, ephemeral CI/CD build agents in Jenkins using the Kubernetes Plugin and Shared Libraries?',
    previewAnswer: 'Use the Jenkins Kubernetes Plugin to spin up ephemeral pod agents dynamically on Kubernetes worker nodes per build job, ensuring isolated, clean build environments with zero idle agent infrastructure cost.',
    fullAnswer: `### Ephemeral Pod Agents Pattern
Instead of static Jenkins worker VMs, Jenkins master spins up temporary Kubernetes pods defined in Jenkinsfile:
\`\`\`groovy
pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: maven
            image: maven:3.9-eclipse-temurin
            command: ['cat']
            tty: true
      '''
    }
  }
  stages {
    stage('Build') {
      steps {
        container('maven') {
          sh 'mvn clean package'
        }
      }
    }
  }
}
\`\`\``,
    realWorldExample: 'Migrating from fixed Jenkins VM slaves to Kubernetes dynamic pod agents saved $14,000/month in idle EC2 costs and eliminated pipeline queue waiting times.',
    architectureDiagram: `Jenkins Master ──► API Request ──► EKS Cluster ──► Spin up Pod Agent ──► Run Build ──► Destroy Pod`,
    commonMistakes: [
      'Mounting the Docker socket (/var/run/docker.sock) inside build agents creating security vulnerabilities instead of using Kaniko or Buildah for rootless container builds.'
    ],
    followUpQuestions: [],
    difficulty: 'Intermediate',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 22100,
    bookmarksCount: 3100,
    sharesCount: 1150,
    signupsConverted: 780,
    publishedAt: '2026-09-08',
    status: 'Published'
  },
  {
    id: 'sre-slo-011',
    cloud: 'SRE',
    category: 'Site Reliability Engineering',
    subcategory: 'SLI/SLO & Error Budgets',
    title: 'How do you calculate SLIs, SLOs, and Error Budgets, and what operational policies trigger when an Error Budget burns to 0%?',
    previewAnswer: 'SLI measures actual system metrics (e.g., successful requests / total requests). SLO is the target reliability threshold (e.g., 99.9%). Error Budget is the allowable unreliability (100% - SLO). When exhausted, feature deployments freeze and engineering focuses 100% on reliability fixes.',
    fullAnswer: `### SRE Reliability Definitions
- **SLI (Service Level Indicator):** A quantitative measurement of service behavior (e.g. Ratio of HTTP 200 responses to total requests over 30 days).
- **SLO (Service Level Objective):** A target reliability goal set by product and SRE teams (e.g. 99.9% availability).
- **Error Budget:** The margin of acceptable failure over a rolling window. For 99.9% SLO over 30 days (43,200 minutes), the Error Budget is **43.2 minutes of total downtime**.

### Error Budget Policy Enforcement
1. **Burn Rate Alerts:** Trigger PagerDuty when 2% of 30-day budget burns within 1 hour.
2. **Exhaustion Freeze:** When Error Budget reaches 0%, automated CI/CD deployment pipelines freeze non-emergency feature deploys until reliability is restored.`,
    realWorldExample: 'Implementing an Error Budget Freeze policy at a global e-commerce firm reduced P0 production incidents by 65% by halting premature feature releases until underlying database connection pool exhaustion bugs were fixed.',
    architectureDiagram: `Total Time Window ──► SLO Goal (99.9%) ──► Remaining Error Budget (43 mins) ──► Burn Alert`,
    commonMistakes: [
      'Setting 100% availability SLO targets which is economically impractical and stifles feature release velocity.',
      'Treating SLAs (legal contracts with financial penalties) as internal engineering SLO targets.'
    ],
    followUpQuestions: [],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 34200,
    bookmarksCount: 5120,
    sharesCount: 1980,
    signupsConverted: 1240,
    publishedAt: '2026-09-10',
    status: 'Published'
  },
  {
    id: 'obs-otel-012',
    cloud: 'Observability',
    category: 'Monitoring & Observability',
    subcategory: 'OpenTelemetry & Tracing',
    title: 'What is the difference between Monitoring and Observability, and how does OpenTelemetry unify Metrics, Logs, and Traces (M.E.L.T.)?',
    previewAnswer: 'Monitoring tells you WHEN a system is broken by observing known metrics (CPU, 5xx rates). Observability allows you to infer WHY a complex distributed system is failing by interrogating internal states through OpenTelemetry traces, structured logs, and metrics.',
    fullAnswer: `### Monitoring vs Observability
- **Monitoring (Known Unknowns):** Dashboarding predefined metrics (e.g. AWS CloudWatch CPU > 90%). Answers: *"Is the system working?"*
- **Observability (Unknown Unknowns):** Correlating high-cardinality distributed traces, logs, and metrics to debug novel microservice failure modes. Answers: *"Why is request X timing out on microservice Y?"*

### OpenTelemetry (OTel) Architecture
OpenTelemetry standardizes telemetry collection across vendors:
\`\`\`yaml
Application Code (OTel SDK) ──► OTel Collector (Receiver ──► Processor ──► Exporter) ──► Prometheus / Jaeger / Datadog
\`\`\``,
    realWorldExample: 'Deploying OpenTelemetry Collector agents across 40 microservices allowed SREs to trace single distributed user checkout requests across EKS, Kafka, and Aurora DB, pinpointing a 4-second database lock contention issue in under 3 minutes.',
    architectureDiagram: `Pod Apps (OTel SDK) ──► OTel Collector DaemonSet ──► Exporters (Prometheus / Jaeger / Loki)`,
    commonMistakes: [
      'Confusing high-cardinality metrics (e.g. tagging Prometheus metrics with user_id or transaction_id) which causes TSDB memory crashes.',
      'Treating distributed tracing as a replacement for structured JSON logging.'
    ],
    followUpQuestions: [],
    difficulty: 'Advanced',
    targetExperience: '3-5 Years',
    isLocked: false,
    viewsCount: 29800,
    bookmarksCount: 4210,
    sharesCount: 1650,
    signupsConverted: 1050,
    publishedAt: '2026-09-12',
    status: 'Published'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-aws',
    cloud: 'AWS',
    name: 'Amazon Web Services',
    description: 'Master core AWS services including EC2, IAM, VPC, EKS, S3, RDS, Lambda, and CloudWatch.',
    questionCount: 450,
    subcategories: ['Compute', 'Networking', 'Storage', 'Security', 'Database', 'Monitoring'],
    iconName: 'Cloud'
  },
  {
    id: 'cat-k8s',
    cloud: 'Kubernetes',
    name: 'Kubernetes & Containers',
    description: 'Production container orchestration, CNI networking, ingress controllers, RBAC, and Helm.',
    questionCount: 380,
    subcategories: ['Architecture', 'Networking', 'Storage', 'Security', 'Troubleshooting'],
    iconName: 'Boxes'
  },
  {
    id: 'cat-tf',
    cloud: 'Terraform',
    name: 'Terraform & IaC',
    description: 'Infrastructure as Code best practices, remote state locking, modules, and CI/CD automation.',
    questionCount: 290,
    subcategories: ['State Management', 'Modules', 'HCL Syntax', 'Cloud Providers'],
    iconName: 'Code2'
  },
  {
    id: 'cat-azure',
    cloud: 'Azure',
    name: 'Microsoft Azure',
    description: 'Azure VM, AKS, Entra ID (Azure AD), Virtual Networks, Key Vault, and ARM/Bicep templates.',
    questionCount: 310,
    subcategories: ['Compute', 'AKS', 'Security & Identity', 'Networking'],
    iconName: 'Server'
  },
  {
    id: 'cat-gcp',
    cloud: 'GCP',
    name: 'Google Cloud Platform',
    description: 'GKE, Google Compute Engine, IAM, Cloud Run, VPC Service Controls, and BigQuery.',
    questionCount: 220,
    subcategories: ['GKE', 'Compute', 'IAM', 'Cloud Run'],
    iconName: 'Globe'
  },
  {
    id: 'cat-secops',
    cloud: 'DevSecOps',
    name: 'DevSecOps & Cloud Security',
    description: 'Container vulnerability scanning, SAST/DAST, secrets management, and compliance guardrails.',
    questionCount: 190,
    subcategories: ['Pipeline Security', 'Secrets', 'Compliance', 'Runtime Security'],
    iconName: 'ShieldCheck'
  },
  {
    id: 'cat-finops',
    cloud: 'FinOps',
    name: 'FinOps & Cost Optimization',
    description: 'Cloud financial management, unit economics, rightsizing, tag governance, and spot strategy.',
    questionCount: 140,
    subcategories: ['Cost Management', 'Rightsizing', 'Commitments', 'Tagging'],
    iconName: 'DollarSign'
  },
  {
    id: 'cat-docker',
    cloud: 'Docker',
    name: 'Docker & Containerization',
    description: 'Master Dockerfiles, multi-stage builds, rootless containers, and layer caching optimization.',
    questionCount: 210,
    subcategories: ['Dockerfile & Multi-Stage', 'Networking', 'Security', 'Layer Caching'],
    iconName: 'Box'
  },
  {
    id: 'cat-helm',
    cloud: 'Helm',
    name: 'Helm Package Manager',
    description: 'Kubernetes package management, release hooks, value overrides, and chart dependency management.',
    questionCount: 160,
    subcategories: ['Templating & Hooks', 'Chart Architecture', 'Release Lifecycle'],
    iconName: 'Layers'
  },
  {
    id: 'cat-argocd',
    cloud: 'ArgoCD',
    name: 'ArgoCD & GitOps',
    description: 'Declarative GitOps deployment, automated sync policies, self-healing, and App-of-Apps pattern.',
    questionCount: 175,
    subcategories: ['Declarative Sync', 'GitOps Drift', 'App of Apps', 'RBAC'],
    iconName: 'RefreshCw'
  },
  {
    id: 'cat-jenkins',
    cloud: 'Jenkins',
    name: 'Jenkins CI/CD Automation',
    description: 'Jenkinsfile Groovy pipelines, Kubernetes pod agents, shared libraries, and credential security.',
    questionCount: 185,
    subcategories: ['Pipeline & Kubernetes Pod Agents', 'Shared Libraries', 'Plugins', 'Security'],
    iconName: 'Terminal'
  },
  {
    id: 'cat-sre',
    cloud: 'SRE',
    name: 'Site Reliability Engineering (SRE)',
    description: 'SLI/SLO formulation, Error Budgets, Incident Response, Observability, and Chaos Engineering.',
    questionCount: 260,
    subcategories: ['SLI/SLO & Error Budgets', 'Observability', 'Incident Response', 'Chaos Engineering'],
    iconName: 'Activity'
  },
  {
    id: 'cat-observability',
    cloud: 'Observability',
    name: 'Monitoring & Observability',
    description: 'OpenTelemetry, Prometheus metrics, Grafana dashboards, distributed tracing, and log aggregation.',
    questionCount: 240,
    subcategories: ['OpenTelemetry & Tracing', 'Prometheus & Grafana', 'Distributed Tracing', 'Logs & Metrics'],
    iconName: 'LineChart'
  }
];

export const MOCK_SCENARIOS: IncidentScenario[] = [
  {
    id: 'scen-001',
    title: 'Production EKS Pod CrashLoopBackOff & 5x Latency Surge',
    cloud: 'Kubernetes',
    difficulty: 'Advanced',
    description: 'At 14:32 UTC, PagerDuty triggered a high-severity alert for the checkout microservice in the production EKS cluster. Pods are in CrashLoopBackOff state, causing 5x higher latency for API requests.',
    logsOutput: `[14:32:01.481] ERROR  checkout-svc-7d9f8b4c-x9z2p [main] Failed to connect to redis-cluster.prod.internal:6379
java.net.ConnectException: Connection refused (Connection timed out)
	at java.net.PlainSocketImpl.socketConnect(Native Method)
[14:32:05.102] WARN   Kubelet Readiness probe failed for container "checkout-app" (HTTP 500)
[14:32:11.890] FATAL OutOfMemoryKilled: Process terminated by OOM killer (Exit Code 137)`,
    initialQuestion: 'Based on the log output, what is your initial diagnostic action?',
    options: [
      {
        id: 'opt-1',
        text: 'Immediately restart the entire Kubernetes cluster master control plane.',
        isCorrect: false,
        explanation: 'Incorrect. Control plane restart does not resolve Pod OOM or network timeout errors and causes unnecessary cluster downtime.'
      },
      {
        id: 'opt-2',
        text: 'Inspect Pod Describe events, memory resource limits, and Redis connectivity.',
        isCorrect: true,
        explanation: 'Correct! Exit code 137 indicates the pod was killed due to memory limits (OOMKilled), and connection refused shows dependency failure with Redis.',
        followupStep: 'After increasing memory limits from 256Mi to 1Gi and restoring Redis cluster connections, pod restarts stabilize.'
      },
      {
        id: 'opt-3',
        text: 'Delete the ingress controller rules and reconfigure DNS.',
        isCorrect: false,
        explanation: 'Incorrect. The issue is pod-internal memory exhaustion and Redis connection failure, not Ingress DNS routing.'
      }
    ],
    rootCauseAnalysis: 'The checkout service suffered a memory leak under high load, causing it to hit its strict container memory limit (256Mi) and get killed by Linux OOM killer (Exit Code 137). Additionally, connection pool exhaustion blocked Redis cache lookups.',
    bestPracticePrevention: 'Set realistic memory requests/limits based on load testing, implement Redis connection pool circuit breaking, and configure horizontal pod autoscaling (HPA) triggered by memory/CPU metrics.'
  },
  {
    id: 'scen-002',
    title: 'AWS S3 Public Data Exposure Risk via Accidental IAM Change',
    cloud: 'AWS',
    difficulty: 'Intermediate',
    description: 'AWS Security Hub flagged an CRITICAL alert: S3 bucket `corp-customer-analytics-prod` public access block was disabled during a Terraform apply execution.',
    logsOutput: `[EVENT_TIME: 2026-09-12T08:14:22Z]
AWS CloudTrail Event: PutBucketPublicAccessBlock
Principal: arn:aws:iam::123456789012:role/TerraformDeployRole
Parameters: {
  "blockPublicAcls": false,
  "ignorePublicAcls": false,
  "blockPublicPolicy": false,
  "restrictPublicBuckets": false
}`,
    initialQuestion: 'What immediate remediation step should you execute?',
    options: [
      {
        id: 'opt-a',
        text: 'Enable AWS S3 Account-Level Block Public Access and audit bucket ACLs.',
        isCorrect: true,
        explanation: 'Correct! Account-level Block Public Access acts as a master override across all current and future S3 buckets in the AWS account.'
      },
      {
        id: 'opt-b',
        text: 'Delete the S3 bucket immediately.',
        isCorrect: false,
        explanation: 'Incorrect. Deleting the production data bucket will cause severe data loss.'
      }
    ],
    rootCauseAnalysis: 'A Terraform script updated `aws_s3_bucket_public_access_block` properties due to an incorrect variable override in staging environment variables.',
    bestPracticePrevention: 'Enforce AWS Organization SCP that denies modifying S3 Block Public Access, and integrate `checkov` / `tfsec` static analysis into CI/CD pipelines.'
  }
];

export const MOCK_MOCK_SESSIONS: MockInterviewSession[] = [
  {
    id: 'sess-001',
    role: 'DevOps Engineer',
    cloud: 'AWS',
    difficulty: 'Advanced',
    date: '2026-09-10',
    durationMinutes: 45,
    radarScores: {
      technicalKnowledge: 82,
      architecture: 74,
      troubleshooting: 68,
      communication: 81,
      security: 63,
      finops: 55
    },
    overallScore: 72,
    keyStrengths: [
      'Strong understanding of AWS EC2, Auto Scaling, and Load Balancing.',
      'Articulate explanation of CI/CD automation pipelines.',
      'Clear verbal communication style during problem solving.'
    ],
    areasToImprove: [
      'Deepen knowledge of AWS IAM Permission Boundaries and SCP precedence.',
      'Practice troubleshooting Kubernetes Pod OOMKilled vs CrashLoopBackOff scenarios.',
      'Study cloud cost governance and FinOps reservation strategies.'
    ],
    interviewerFeedback: 'Alex demonstrated solid core DevOps concepts. With targeted study on IAM security boundaries and FinOps optimization, Alex will be ready for Senior Cloud Engineer interviews!'
  }
];

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'usr-101',
  name: 'Alex Mercer',
  email: 'alex.mercer@clouddevops.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'DevOps Engineer',
  experienceLevel: '3-5 Years',
  targetCloud: 'AWS',
  targetInterviewDate: '2026-10-15',
  bio: 'Passionate DevOps and Cloud Infrastructure Specialist focused on Kubernetes orchestration, Terraform automation, and AWS multi-account governance.',
  githubUrl: 'https://github.com/alex-mercer-devops',
  linkedinUrl: 'https://linkedin.com/in/alex-mercer-cloud',
  targetSalary: '$145,000 - $170,000 / year',
  targetCompanies: ['AWS', 'Datadog', 'HashiCorp', 'Stripe'],
  accountType: 'Pro Member',
  readinessPercentage: 72,
  completedQuestionIds: ['aws-ec2-001', 'tf-state-004'],
  bookmarkedQuestionIds: ['aws-iam-002', 'k8s-net-003'],
  completedScenarioIds: ['scen-001'],
  streakDays: 7,
  xpPoints: 1250,
  badges: [
    { id: 'b1', title: 'AWS Explorer', icon: 'Cloud', unlockedAt: '2026-09-01' },
    { id: 'b2', title: '7 Day Streak', icon: 'Flame', unlockedAt: '2026-09-14' },
    { id: 'b3', title: 'Scenario Master', icon: 'ShieldAlert', unlockedAt: '2026-09-12' },
    { id: 'b4', title: 'Architect Initiate', icon: 'Layers', unlockedAt: '2026-09-15' }
  ],
  certifications: [
    { id: 'c1', title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', issuedDate: '2025-06-10', credentialId: 'AWS-00391029', verifyUrl: 'https://aws.amazon.com/verify' },
    { id: 'c2', title: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF / Linux Foundation', issuedDate: '2025-11-20', credentialId: 'LF-CKA-99210', verifyUrl: 'https://cnc.io/verify' },
    { id: 'c3', title: 'HashiCorp Certified: Terraform Associate', issuer: 'HashiCorp', issuedDate: '2026-02-14', credentialId: 'HC-TF-88102' }
  ],
  skillsBreakdown: [
    { skill: 'AWS Core & EC2/VPC', category: 'AWS', percentage: 88, status: 'Mastered' },
    { skill: 'Kubernetes & Helm', category: 'Kubernetes', percentage: 76, status: 'Proficient' },
    { skill: 'Terraform IaC State', category: 'Terraform', percentage: 82, status: 'Mastered' },
    { skill: 'CI/CD & GitHub Actions', category: 'DevOps', percentage: 90, status: 'Mastered' },
    { skill: 'AWS IAM & SCP Security', category: 'DevSecOps', percentage: 60, status: 'Learning' },
    { skill: 'Cloud FinOps & Rightsizing', category: 'FinOps', percentage: 54, status: 'Learning' }
  ]
};

export const MOCK_ADMIN_USER_PROFILE: UserProfile = {
  id: 'usr-admin',
  name: 'System Super Admin',
  email: 'admin@cloudinterviewlab.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  role: 'Cloud Architect',
  experienceLevel: '8+ Years',
  targetCloud: 'Multi-cloud',
  targetInterviewDate: '2026-12-31',
  bio: 'Platform Lead & Super Admin overseeing CloudForge DevOps question repository, candidate directories, and analytics.',
  targetSalary: '$200,000+ / year',
  targetCompanies: ['AWS', 'Google Cloud', 'Microsoft'],
  accountType: 'Enterprise',
  readinessPercentage: 100,
  completedQuestionIds: [],
  bookmarkedQuestionIds: [],
  completedScenarioIds: [],
  streakDays: 30,
  xpPoints: 9999,
  badges: [
    { id: 'b-admin', title: 'System Administrator', icon: 'ShieldCheck', unlockedAt: '2026-01-01' }
  ]
};

export const MOCK_ALL_USERS: UserProfile[] = [
  MOCK_USER_PROFILE,
  MOCK_ADMIN_USER_PROFILE
];


export const MOCK_ANALYTICS_EVENTS: AnalyticsEvent[] = [
  { id: 'e1', eventType: 'page_viewed', source: 'google', device: 'desktop', timestamp: '2026-09-16 10:15:00' },
  { id: 'e2', eventType: 'question_viewed', contentId: 'aws-ec2-001', source: 'linkedin', device: 'mobile', timestamp: '2026-09-16 10:18:22' },
  { id: 'e3', eventType: 'answer_unlocked', contentId: 'aws-ec2-001', source: 'linkedin', device: 'mobile', timestamp: '2026-09-16 10:19:05' },
  { id: 'e4', eventType: 'signup_completed', source: 'linkedin', device: 'mobile', timestamp: '2026-09-16 10:20:11' },
  { id: 'e5', eventType: 'scenario_completed', contentId: 'scen-001', source: 'direct', device: 'desktop', timestamp: '2026-09-16 11:05:40' },
  { id: 'e6', eventType: 'mock_interview_completed', source: 'direct', device: 'desktop', timestamp: '2026-09-16 11:50:00' }
];

export const MOCK_SEARCH_LOGS: SearchQueryLog[] = [
  { query: 'eks troubleshooting crashloopbackoff', count: 4821, hasResult: true, conversionRate: 18.4 },
  { query: 'terraform state s3 dynamodb locking', count: 3912, hasResult: true, conversionRate: 15.2 },
  { query: 'aws iam explicit deny vs allow policy', count: 3102, hasResult: true, conversionRate: 21.0 },
  { query: 'azure aks cni vs kubenet difference', count: 2840, hasResult: true, conversionRate: 12.8 },
  { query: 'finops cloud cost rightsizing AWS', count: 1920, hasResult: true, conversionRate: 14.5 },
  { query: 'gcp vpc service controls interview questions', count: 1450, hasResult: false, conversionRate: 0.0 }
];

export const SAMPLE_JOB_POSTINGS = [
  {
    title: 'Senior DevOps & Cloud Infrastructure Engineer',
    company: 'FinTech Cloud Solutions',
    text: `We are looking for a Senior DevOps Engineer with 4+ years experience building highly available AWS infrastructure.
    Requirements:
    - Strong expertise in AWS (EC2, VPC, IAM, EKS, Route53, S3, CloudWatch).
    - Advanced Kubernetes administration and CNI networking (Calico / AWS VPC CNI).
    - Infrastructure as Code with Terraform and state locking.
    - CI/CD pipelines with GitHub Actions or GitLab CI.
    - Experience implementing DevSecOps container security (Trivy / Snyk) and FinOps cost optimization.`
  }
];
