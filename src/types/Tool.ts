type ToolId =
	| "typescript"
	| "javascript"
	| "nestjs"
	| "sql"
    | "nosql"
    | "k8s"
    | "elastic"
    | "rabbitmq"
    | "openshift"
    | "vue"
    | "astro"
    | "react"

type ToolName =
	| "Typescript"
	| "Javascript"
	| "NestJS"
	| "Sql"
    | "NoSQL"
    | "K8s"
    | "Elastic"
    | "RabbitMQ"
    | "Openshift"
    | "Vue"
    | "Astro"
    | "React"

export interface Tool {
    id: ToolId
	name: ToolName
}