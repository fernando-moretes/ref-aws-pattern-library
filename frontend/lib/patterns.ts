export type Category =
  | "web"
  | "api"
  | "data"
  | "events"
  | "ml"
  | "iot"
  | "security"
  | "devops"
  | "hybrid"
  | "batch";

export type Pattern = {
  slug: string;
  title: string;
  tagline: string;
  category: Category;
  services: string[];
  description: string;
  whenToUse: string[];
  whenToAvoid: string[];
  mermaid: string;
  context: string;
  decision: string;
  consequences: string[];
  costEstimate: string;
  pillars: {
    operationalExcellence?: string;
    security?: string;
    reliability?: string;
    performance?: string;
    cost?: string;
    sustainability?: string;
  };
  references?: { label: string; url: string }[];
};

export const PATTERNS: Pattern[] = [
  {
    slug: "three-tier-web",
    title: "Three-Tier Web Application",
    tagline: "Classic CloudFront + ALB + ECS Fargate + Aurora.",
    category: "web",
    services: ["CloudFront", "WAF", "ALB", "ECS Fargate", "Aurora", "ElastiCache", "S3"],
    description:
      "A pragmatic baseline for stateful web apps. CloudFront caches and protects, ALB routes to the app tier, Aurora holds relational state, ElastiCache reduces hot-path latency.",
    whenToUse: [
      "Single team owning a monolith or small set of services.",
      "Steady traffic with predictable scaling.",
      "Need relational guarantees with managed ops.",
    ],
    whenToAvoid: ["Bursty workloads where Lambda fits better.", "True multi-region active-active needs."],
    mermaid: `flowchart LR
  U((User)) --> CF[CloudFront]
  CF --> WAF[AWS WAF]
  WAF --> ALB[ALB]
  ALB --> APP[ECS Fargate]
  APP --> DB[(Aurora)]
  APP --> CACHE[(ElastiCache)]
  APP --> S3[(S3 Assets)]
  CF -.cache.-> S3`,
    context: "Need a managed, secure baseline for a web app with stateful relational data and predictable scaling.",
    decision:
      "Adopt CloudFront → WAF → ALB → Fargate → Aurora with ElastiCache. Static assets served from S3 via CloudFront.",
    consequences: [
      "Single-region active footprint; multi-region is a follow-up decision.",
      "Container images become a unit of delivery; need CI to ECR.",
      "Aurora reduces ops but introduces vendor coupling.",
    ],
    costEstimate: "$300–$700/month for a small workload (ALB, 2 Fargate tasks, db.t3.medium Aurora).",
    pillars: {
      security: "WAF, KMS at rest, IAM roles per task, secrets in Secrets Manager.",
      reliability: "Multi-AZ Fargate + Aurora Multi-AZ; ALB health checks.",
      cost: "Fargate Spot for non-critical tasks; Aurora Serverless v2 for variable load.",
    },
  },
  {
    slug: "serverless-api",
    title: "Serverless REST API",
    tagline: "API Gateway HTTP + Lambda + DynamoDB.",
    category: "api",
    services: ["API Gateway", "Lambda", "DynamoDB", "CloudFront", "X-Ray"],
    description:
      "A pay-per-use API for unpredictable load. API Gateway terminates HTTPS, Lambda handles requests, DynamoDB persists.",
    whenToUse: ["Spiky / unpredictable traffic.", "Small, well-bounded API surface.", "Event-driven friendly teams."],
    whenToAvoid: ["Requests > 29s.", "Workloads requiring complex relational joins."],
    mermaid: `flowchart LR
  U((Client)) --> CF[CloudFront]
  CF --> AG[API Gateway HTTP]
  AG --> L[(Lambda)]
  L --> D[(DynamoDB)]
  L --> CW[CloudWatch]
  L --> XR[X-Ray]`,
    context: "Need a low-ops API that scales to zero and to thousands of req/s.",
    decision: "API Gateway HTTP API → Lambda → DynamoDB; CloudFront in front for caching and WAF.",
    consequences: [
      "No idle cost; per-request scaling.",
      "Cold starts must be considered for hot endpoints.",
      "DynamoDB schema needs up-front access-pattern design.",
    ],
    costEstimate: "~$5–15/month at 1M requests with avg 200ms Lambda + DynamoDB on-demand.",
    pillars: {
      security: "IAM auth or Cognito; per-function execution role; KMS for DynamoDB.",
      reliability: "Multi-AZ; DLQs on Lambda; on-demand DynamoDB.",
      cost: "Pay per request; reserved concurrency to cap blast radius.",
      performance: "Provisioned concurrency for hot endpoints; DynamoDB DAX if needed.",
    },
  },
  {
    slug: "graphql-appsync",
    title: "Managed GraphQL with AppSync",
    tagline: "AppSync + DynamoDB + Lambda resolvers.",
    category: "api",
    services: ["AppSync", "DynamoDB", "Lambda", "Cognito", "CloudFront"],
    description:
      "Managed GraphQL with subscriptions over WebSockets, native auth via Cognito and pluggable resolvers (DynamoDB, Lambda, HTTP).",
    whenToUse: ["Mobile / web clients with heterogeneous data needs.", "Real-time subscriptions."],
    whenToAvoid: ["Public, simple CRUD APIs without subscription needs (use REST + Lambda)."],
    mermaid: `flowchart LR
  U((Client)) --> AS[AppSync]
  U -.subscriptions.-> AS
  AS --> COG[Cognito]
  AS --> DDB[(DynamoDB)]
  AS --> LR[(Lambda Resolvers)]
  LR --> EXT[External APIs]`,
    context: "Need a typed, real-time API for multiple client surfaces without bespoke WebSocket plumbing.",
    decision: "Adopt AppSync as the GraphQL gateway with DynamoDB and Lambda resolvers; Cognito for auth.",
    consequences: ["Schema becomes a contract.", "GraphQL learning curve for new contributors."],
    costEstimate: "$4 per million queries + Cognito MAU + DynamoDB.",
    pillars: { security: "Cognito user pools; per-field auth.", reliability: "Multi-AZ managed service." },
  },
  {
    slug: "static-spa",
    title: "Static SPA on CloudFront",
    tagline: "S3 + CloudFront + ACM + Route 53.",
    category: "web",
    services: ["S3", "CloudFront", "WAF", "Route 53"],
    description: "Pure static frontend served from S3 behind CloudFront with TLS and Route 53 DNS.",
    whenToUse: ["Marketing sites, dashboards, SPAs talking to APIs."],
    whenToAvoid: ["Per-request server-side personalization."],
    mermaid: `flowchart LR
  U((User)) --> R53[Route 53]
  R53 --> CF[CloudFront]
  CF --> WAF[WAF]
  WAF --> S3[(S3)]`,
    context: "Static frontend needs low-cost, globally fast, secure delivery.",
    decision: "S3 with OAC behind CloudFront; WAF; ACM TLS; Route 53 DNS.",
    consequences: ["Cache invalidations on deploy.", "Origin S3 must be private."],
    costEstimate: "Often < $5/month for low-traffic sites.",
    pillars: { security: "OAC, WAF, HSTS.", cost: "Most traffic is cache hits." },
  },
  {
    slug: "data-lake",
    title: "Data Lake on S3",
    tagline: "S3 + Glue + Athena + Lake Formation.",
    category: "data",
    services: ["S3", "Glue", "Athena", "Lake Formation", "Kinesis"],
    description: "S3 storage zones (raw / curated), Glue ETL and catalog, Athena SQL, Kinesis ingestion.",
    whenToUse: ["Multi-source analytical workloads.", "Ad-hoc SQL on S3."],
    whenToAvoid: ["Sub-second BI queries — use Redshift.", "Tiny datasets."],
    mermaid: `flowchart LR
  SRC[Sources] --> KIN[Kinesis]
  KIN --> RAW[(S3 raw)]
  RAW --> GLUE[Glue ETL]
  GLUE --> CUR[(S3 curated)]
  CUR --> ATH[Athena]
  CUR --> CAT[Glue Catalog]`,
    context: "Land event/source data centrally for analytics without committing to a single warehouse.",
    decision: "S3 with raw/curated zones, Glue for ETL/catalog, Athena as default query engine.",
    consequences: ["Open formats keep us portable.", "Scanned bytes drive cost — partition!"],
    costEstimate: "Storage dominates: $23/TB-month Standard, $4/TB-month Glacier Deep Archive. Athena $5/TB scanned.",
    pillars: {
      security: "Lake Formation row/column-level access; KMS-encrypted buckets.",
      cost: "Lifecycle to IA / Glacier; partitioned Parquet.",
    },
  },
  {
    slug: "lakehouse-iceberg",
    title: "Lakehouse with Apache Iceberg",
    tagline: "S3 + Iceberg + Athena + EMR Serverless.",
    category: "data",
    services: ["S3", "Athena", "EMR Serverless", "Glue", "Iceberg"],
    description: "Apache Iceberg tables on S3 give ACID, time-travel and schema evolution to a data lake.",
    whenToUse: ["You need ACID and time travel without committing to a single warehouse."],
    whenToAvoid: ["Tiny datasets where Glue overhead is excessive."],
    mermaid: `flowchart LR
  SRC[Sources] --> EMR[EMR Serverless]
  EMR --> ICE[(S3 + Iceberg tables)]
  ICE --> ATH[Athena]
  ICE --> CAT[Glue Catalog]`,
    context: "Data lake needs ACID transactions, schema evolution and time travel.",
    decision: "Adopt Iceberg as the table format on S3; query via Athena and EMR Serverless.",
    consequences: ["Open table format keeps lock-in low.", "Compaction maintenance becomes routine."],
    costEstimate: "Storage + EMR Serverless DPU-hours + Athena scans.",
    pillars: { performance: "Hidden partitioning and metadata pruning reduce scans." },
  },
  {
    slug: "event-driven-microservices",
    title: "Event-Driven Microservices",
    tagline: "EventBridge + SQS + Lambda + DynamoDB.",
    category: "events",
    services: ["EventBridge", "SQS", "Lambda", "DynamoDB", "SNS"],
    description: "Producers emit domain events to EventBridge; consumers subscribe via rules; SQS adds DLQs.",
    whenToUse: ["Multiple bounded contexts needing async communication.", "Loose coupling and replay."],
    whenToAvoid: ["Strict synchronous contracts.", "Tiny systems."],
    mermaid: `flowchart LR
  P[Producer] --> EB((EventBridge))
  EB -->|order.created| Q1[SQS]
  EB -->|order.created| Q2[SQS]
  Q1 --> L1[(Lambda billing)]
  Q2 --> L2[(Lambda notify)]
  Q1 -.dlq.-> DLQ1[(DLQ)]`,
    context: "Multiple teams need to react to domain events without runtime coupling.",
    decision: "EventBridge as central bus; consumers subscribe via rules; SQS for buffering and DLQs.",
    consequences: ["Schemas become contracts.", "Idempotency is the consumer's responsibility.", "Replay via archive."],
    costEstimate: "< $10/month for 10M events.",
    pillars: { reliability: "DLQs, retries with backoff, archives.", "operationalExcellence": "Schema registry, event catalog." },
  },
  {
    slug: "saga-orchestration",
    title: "Saga with Step Functions",
    tagline: "Step Functions Standard + Lambda + DynamoDB compensations.",
    category: "events",
    services: ["Step Functions", "Lambda", "DynamoDB", "SQS"],
    description:
      "Long-running transactions modeled as a Step Functions state machine with explicit compensation steps.",
    whenToUse: ["Distributed transactions across multiple services.", "Workflows with human-in-the-loop steps."],
    whenToAvoid: ["Sub-second strongly-consistent transactions."],
    mermaid: `flowchart LR
  S[Start] --> R[Reserve Inventory]
  R --> P[Charge Payment]
  P --> SH[Schedule Shipment]
  SH --> E[End]
  P -. fail .-> CR[Compensate Reserve]
  SH -. fail .-> RP[Refund]`,
    context: "Need durable, observable distributed transactions with explicit compensation.",
    decision: "Step Functions Standard workflow with Lambda task states and DynamoDB for saga state.",
    consequences: ["Compensation logic must be designed up-front.", "State transitions cost money — tune granularity."],
    costEstimate: "$25 per million state transitions (Standard).",
    pillars: { reliability: "Built-in retries, error catches, durable state." },
  },
  {
    slug: "kafka-streaming",
    title: "Streaming with MSK",
    tagline: "MSK + Kafka Connect + Flink + S3.",
    category: "events",
    services: ["MSK", "Kafka Connect", "Flink", "S3", "OpenSearch"],
    description: "High-throughput streaming with Kafka semantics; Flink for stateful stream processing.",
    whenToUse: ["High-throughput, ordered partitions, replay.", "Existing Kafka tooling."],
    whenToAvoid: ["Low-volume event-driven systems where EventBridge fits."],
    mermaid: `flowchart LR
  P[Producers] --> MSK[(MSK Kafka)]
  MSK --> FL[Apache Flink]
  FL --> OS[(OpenSearch)]
  FL --> S3[(S3 sink)]
  MSK --> KC[Kafka Connect]`,
    context: "Need high-throughput streaming with replay, ordering and rich downstream processing.",
    decision: "Adopt MSK with Kafka Connect for sinks and Flink for stateful processing.",
    consequences: ["Operational surface higher than EventBridge.", "Rich ecosystem of connectors."],
    costEstimate: "From ~$460/month for a 3-broker MSK cluster.",
    pillars: { performance: "Partitioned topics scale linearly." },
  },
  {
    slug: "iot-ingest",
    title: "IoT Ingest at Scale",
    tagline: "IoT Core + Kinesis + Timestream + Grafana.",
    category: "iot",
    services: ["IoT Core", "Kinesis", "Timestream", "Lambda", "Managed Grafana"],
    description: "MQTT ingestion at scale, routed to Kinesis for buffering and Timestream for time-series storage.",
    whenToUse: ["Millions of devices reporting telemetry."],
    whenToAvoid: ["Batch-style telemetry with hourly cadence — S3 Direct + Athena suffices."],
    mermaid: `flowchart LR
  D[Devices] -->|MQTT| IOT[IoT Core]
  IOT --> KIN[Kinesis]
  KIN --> L[(Lambda transform)]
  L --> TS[(Timestream)]
  TS --> G[Managed Grafana]`,
    context: "Need to ingest device telemetry at scale and visualize trends.",
    decision: "MQTT to IoT Core → Kinesis → Lambda transform → Timestream → Grafana.",
    consequences: ["Schema evolves with device firmware versions.", "Timestream pricing scales with retention."],
    costEstimate: "Tens to hundreds USD per month depending on device count and retention.",
    pillars: { reliability: "Managed brokers and partitions handle scale." },
  },
  {
    slug: "ml-realtime",
    title: "Real-time ML Inference",
    tagline: "SageMaker endpoint + API Gateway + Lambda.",
    category: "ml",
    services: ["SageMaker", "API Gateway", "Lambda", "DynamoDB", "Kinesis"],
    description: "Low-latency inference behind a public API; logs back to Kinesis for monitoring.",
    whenToUse: ["Per-request scoring with < 100ms latency budget."],
    whenToAvoid: ["Daily / hourly batch scoring (use batch transform)."],
    mermaid: `flowchart LR
  C[Client] --> AG[API Gateway]
  AG --> L[(Lambda)]
  L --> SM[SageMaker Endpoint]
  L --> DDB[(DynamoDB feature store)]
  L --> KIN[Kinesis logs]`,
    context: "Need low-latency model inference behind a public API.",
    decision: "Stateful SageMaker endpoint fronted by API Gateway and a Lambda for feature lookup.",
    consequences: ["Endpoint cost runs 24/7.", "Cold starts on Lambda are bounded by warm pool."],
    costEstimate: "$0.04–$0.20/hour per endpoint instance.",
    pillars: { performance: "Multi-model endpoints reduce cost.", reliability: "Auto-scaling per-variant." },
  },
  {
    slug: "ml-batch-inference",
    title: "Batch ML Inference",
    tagline: "EventBridge cron + Step Functions + SageMaker Batch Transform.",
    category: "ml",
    services: ["Step Functions", "SageMaker", "S3", "EventBridge", "Lambda"],
    description: "Scheduled batch scoring with no idle endpoint cost.",
    whenToUse: ["Daily / hourly model scoring on data lake batches."],
    whenToAvoid: ["Real-time scoring needs."],
    mermaid: `flowchart LR
  C[EventBridge cron] --> SF[Step Functions]
  SF --> PRE[Lambda prepare]
  PRE --> S3I[(S3 input)]
  SF --> SM[SageMaker Batch]
  S3I --> SM
  SM --> S3O[(S3 output)]`,
    context: "Scheduled, scalable model scoring without standing up a real-time endpoint.",
    decision: "Step Functions orchestrating Lambda + SageMaker Batch Transform; EventBridge cron triggers.",
    consequences: ["No idle endpoint cost.", "Latency is hours, not milliseconds."],
    costEstimate: "ml.m5.large for 30 min/day ≈ $1.50/day.",
    pillars: { cost: "Pay only when scoring runs." },
  },
  {
    slug: "genai-rag-bedrock",
    title: "GenAI RAG with Bedrock",
    tagline: "Bedrock + Knowledge Bases + OpenSearch Serverless.",
    category: "ml",
    services: ["Bedrock", "OpenSearch Serverless", "S3", "API Gateway", "Lambda"],
    description: "Retrieval-augmented generation: documents indexed in OpenSearch Serverless, queries through Bedrock.",
    whenToUse: ["Internal Q&A on private documents.", "Summarization grounded in your corpus."],
    whenToAvoid: ["Real-time low-latency chat without retrieval needs."],
    mermaid: `flowchart LR
  U[User] --> AG[API Gateway]
  AG --> L[(Lambda)]
  L --> KB[Bedrock KB]
  KB --> OSS[OpenSearch Serverless]
  KB --> S3[(S3 docs)]
  KB --> BR[Bedrock LLM]`,
    context: "Need answers grounded in private documents with traceable citations.",
    decision: "Bedrock Knowledge Bases backed by OpenSearch Serverless for retrieval; LLM via Bedrock.",
    consequences: ["Token costs scale with usage.", "Embedding refresh strategy needs design."],
    costEstimate: "Per-token Bedrock pricing + OpenSearch Serverless OCU-hours.",
    pillars: { security: "Per-tenant filters on retrieval; KMS at rest." },
  },
  {
    slug: "vpc-multi-account",
    title: "Multi-Account VPC with Transit Gateway",
    tagline: "Organizations + Transit Gateway + Resource Access Manager.",
    category: "hybrid",
    services: ["Organizations", "Transit Gateway", "VPC", "Resource Access Manager", "Direct Connect"],
    description:
      "Hub-and-spoke connectivity across accounts with shared services VPC and on-prem via Direct Connect.",
    whenToUse: ["Enterprise multi-account landing zone."],
    whenToAvoid: ["Single-account, single-team workloads."],
    mermaid: `flowchart LR
  ONP[On-Prem] --- DX[Direct Connect]
  DX --- TGW[Transit Gateway]
  TGW --- A[(Account A VPC)]
  TGW --- B[(Account B VPC)]
  TGW --- SS[(Shared Services VPC)]`,
    context: "Need scalable, secure connectivity across many AWS accounts and on-premises.",
    decision: "Transit Gateway as hub; share via RAM; on-prem via Direct Connect.",
    consequences: ["TGW per-attachment hourly cost.", "Routing policy becomes a first-class artifact."],
    costEstimate: "$0.05/hour per attachment + data processing.",
    pillars: { security: "Per-VPC route tables; segmentation by environment." },
  },
  {
    slug: "blue-green-ecs",
    title: "Blue/Green Deploys on ECS",
    tagline: "ECS + CodeDeploy + ALB target groups.",
    category: "devops",
    services: ["ECS", "CodeDeploy", "ALB", "CloudWatch"],
    description: "Zero-downtime deploys with traffic shifting and automatic rollback on alarms.",
    whenToUse: ["Production services where downtime is unacceptable."],
    whenToAvoid: ["Stateful long-lived connections that complicate cutovers."],
    mermaid: `flowchart LR
  CI[CI build] --> CD[CodeDeploy]
  CD --> BG[ECS Blue]
  CD --> GR[ECS Green]
  ALB[ALB] --> BG
  ALB --> GR
  CW[CloudWatch alarms] -.rollback.-> CD`,
    context: "Need safe zero-downtime deploys with automatic rollback.",
    decision: "ECS + CodeDeploy with ALB target groups; alarms gate traffic shifts.",
    consequences: ["Two task sets run during shift.", "Rollback is automatic and fast."],
    costEstimate: "Marginal — pay only for the extra task set during the shift.",
    pillars: { operationalExcellence: "Automatic rollback on alarms." },
  },
  {
    slug: "container-platform-eks",
    title: "Container Platform on EKS",
    tagline: "EKS + Karpenter + ALB Controller + ArgoCD.",
    category: "devops",
    services: ["EKS", "Karpenter", "ALB", "ArgoCD", "CloudWatch"],
    description: "Self-service container platform with GitOps, autoscaling and ingress per tenant.",
    whenToUse: ["Multiple teams shipping containerized services.", "Existing Kubernetes investment."],
    whenToAvoid: ["Small teams without K8s expertise — ECS is friendlier."],
    mermaid: `flowchart LR
  G[Git repo] --> AR[ArgoCD]
  AR --> EKS[EKS]
  EKS --> KP[Karpenter]
  EKS --> ALB[ALB]
  ALB --> APP[Workloads]
  EKS --> CW[CloudWatch]`,
    context: "Multiple teams want to ship containerized services with self-service.",
    decision: "EKS with Karpenter for scaling, ArgoCD for GitOps, AWS Load Balancer Controller for ingress.",
    consequences: ["Platform-engineering investment required.", "Better cost-efficiency than blanket ASGs."],
    costEstimate: "$0.10/hour per cluster + nodes; Karpenter optimizes spot/on-demand mix.",
    pillars: { operationalExcellence: "GitOps, drift detection." },
  },
  {
    slug: "ci-cd-pipeline",
    title: "CI/CD with CodePipeline",
    tagline: "CodeCommit/Git → CodeBuild → CodeDeploy.",
    category: "devops",
    services: ["CodePipeline", "CodeBuild", "CodeDeploy", "S3", "CloudWatch"],
    description: "End-to-end pipeline with build, scan, test, deploy and approvals.",
    whenToUse: ["Teams standardizing on AWS-native CI/CD."],
    whenToAvoid: ["Teams already happy with GitHub Actions / GitLab CI."],
    mermaid: `flowchart LR
  GIT[Git] --> CP[CodePipeline]
  CP --> CB[CodeBuild]
  CB --> ART[(S3 Artifacts)]
  CP --> CD[CodeDeploy]
  CD --> ENV[Environments]`,
    context: "Need a managed pipeline integrated with AWS deploy targets.",
    decision: "CodePipeline orchestrates CodeBuild and CodeDeploy with S3 artifacts.",
    consequences: ["Vendor-coupled pipeline.", "First-class AWS service integrations."],
    costEstimate: "$1 per active pipeline-month + CodeBuild minutes.",
    pillars: { operationalExcellence: "Manual approval stages possible." },
  },
  {
    slug: "secrets-rotation",
    title: "Secrets Rotation",
    tagline: "Secrets Manager + Lambda rotation.",
    category: "security",
    services: ["Secrets Manager", "Lambda", "RDS", "KMS"],
    description: "Automatic rotation for database credentials and third-party API keys.",
    whenToUse: ["Compliance regimes requiring rotation."],
    whenToAvoid: ["Secrets that cannot be safely rotated without app coordination."],
    mermaid: `flowchart LR
  SM[Secrets Manager] -->|invoke| ROT[(Lambda Rotation)]
  ROT --> RDS[(RDS)]
  ROT --> KMS[KMS]`,
    context: "Need automatic rotation of credentials with minimal app changes.",
    decision: "Secrets Manager with rotation Lambdas; KMS-encrypted at rest.",
    consequences: ["Rotation logic per secret type.", "Improved compliance posture."],
    costEstimate: "$0.40/secret-month + per 10k API calls.",
    pillars: { security: "Auditable rotation; per-secret access policies." },
  },
  {
    slug: "guardduty-securityhub",
    title: "Security Posture with GuardDuty + Security Hub",
    tagline: "GuardDuty + Security Hub + Config + IAM Access Analyzer.",
    category: "security",
    services: ["GuardDuty", "Security Hub", "Config", "IAM Access Analyzer", "EventBridge"],
    description:
      "Centralized findings across accounts, with drift detection and threat detection wired to alerts.",
    whenToUse: ["Multi-account organizations needing a single pane of glass."],
    whenToAvoid: ["Single-account learning environments."],
    mermaid: `flowchart LR
  GD[GuardDuty] --> SH[Security Hub]
  CFG[Config] --> SH
  IAA[Access Analyzer] --> SH
  SH --> EB[EventBridge]
  EB --> ALERT[SNS / Slack]`,
    context: "Need a unified security posture across accounts.",
    decision: "Aggregate findings in Security Hub from GuardDuty, Config and Access Analyzer; route via EventBridge.",
    consequences: ["Per-account enablement managed via Organizations.", "Findings drive automated remediations."],
    costEstimate: "Per-finding and per-resource cost; budget per account.",
    pillars: { security: "Continuous monitoring; threat detection." },
  },
  {
    slug: "batch-on-aws",
    title: "Batch Workloads with AWS Batch",
    tagline: "AWS Batch + EC2 Spot + S3.",
    category: "batch",
    services: ["AWS Batch", "EC2 Spot", "S3", "ECR", "EventBridge"],
    description: "Scheduled or event-driven batch jobs with managed compute environments and Spot.",
    whenToUse: ["Genomics, Monte Carlo, ML training, video transcoding."],
    whenToAvoid: ["Real-time workloads."],
    mermaid: `flowchart LR
  EVT[EventBridge] --> JQ[Job Queue]
  JQ --> CE[Compute Env]
  CE --> EC2[EC2 Spot]
  EC2 --> S3[(S3)]`,
    context: "Need elastic batch compute without manual queue management.",
    decision: "AWS Batch with managed compute environment on EC2 Spot; ECR images.",
    consequences: ["Spot interruptions must be handled.", "Strong cost efficiency."],
    costEstimate: "Spot can be 70–90% cheaper than On-Demand.",
    pillars: { cost: "Spot maximizes savings." },
  },
  {
    slug: "cross-region-dr",
    title: "Cross-Region DR (Pilot Light)",
    tagline: "Cross-region replication + Route 53 failover.",
    category: "hybrid",
    services: ["Aurora Global", "S3 CRR", "Route 53", "Backup"],
    description: "Pilot-light DR with replicated data and a small standby footprint.",
    whenToUse: ["RTO of minutes-to-hours and RPO of seconds-to-minutes."],
    whenToAvoid: ["Sub-minute RTO needs (use multi-region active-active)."],
    mermaid: `flowchart LR
  PR[Primary Region] -->|Aurora Global| DR[DR Region]
  PR -->|S3 CRR| DR
  R53[Route 53] -.failover.-> DR`,
    context: "Need resilience against a region-wide outage with bounded budget.",
    decision: "Aurora Global + S3 CRR; Route 53 health-check failover; runbook for promotion.",
    consequences: ["DR drills become a recurring practice.", "Standby footprint adds ~10–20% cost."],
    costEstimate: "Replication egress + standby compute (~10–20% of primary).",
    pillars: { reliability: "Tested failover; documented runbooks." },
  },
  {
    slug: "wordpress-managed",
    title: "Managed WordPress on Lightsail",
    tagline: "Lightsail + CloudFront + S3 backups.",
    category: "web",
    services: ["Lightsail", "CloudFront", "S3", "Route 53"],
    description: "Low-ops WordPress hosting for marketing-heavy use cases.",
    whenToUse: ["Marketing sites, brochureware, blogs."],
    whenToAvoid: ["High-traffic e-commerce."],
    mermaid: `flowchart LR
  U((User)) --> R53[Route 53]
  R53 --> CF[CloudFront]
  CF --> LS[Lightsail Instance]
  LS --> S3[(S3 backups)]`,
    context: "Marketing site needs low-ops hosting.",
    decision: "Lightsail with CloudFront in front; S3 for backups.",
    consequences: ["Limited horizontal scaling.", "Predictable monthly cost."],
    costEstimate: "$10–$40/month for the Lightsail tier.",
    pillars: { cost: "Predictable bundle pricing." },
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  web: "Web",
  api: "API",
  data: "Data",
  events: "Events",
  ml: "ML / AI",
  iot: "IoT",
  security: "Security",
  devops: "DevOps",
  hybrid: "Hybrid / Networking",
  batch: "Batch",
};

export function findPattern(slug: string): Pattern | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}

export function searchPatterns(query: string, category?: Category | "all"): Pattern[] {
  const q = query.trim().toLowerCase();
  return PATTERNS.filter((p) => {
    if (category && category !== "all" && p.category !== category) return false;
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.services.some((s) => s.toLowerCase().includes(q))
    );
  });
}
