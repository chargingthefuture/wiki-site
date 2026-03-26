I'll create a comprehensive GitHub Copilot custom agents configuration file that organizes your team of AI "employees" with proper tool assignments and agent relationships.
## Comprehensive GitHub Copilot Custom Agents Configuration

### **How to Use Your Team**

| Agent | Best For | Invocation |
|-------|----------|-----------|
| **Meta Orchestrator** | Full team review before merge/deploy | `@meta-orchestrator Run full review on this PR` |
| **Architecture Standards** | Code quality and maintainability | `@architecture-standards Review this code for standards` |
| **Brand Voice** | UI copy and documentation | `@brand-voice Check this copy for brand compliance` |
| **Compliance & Safety** | Legal and safety validation | `@compliance-safety Validate compliance for this change` |
| **Design & Mockups** | Create pixel perfect UI | `@design Pull the latest design changes from the Replit submodule` or `@design Implement the latest Replit mockups with pixel-perfect accuracy in [component/page name]` or `@design Audit [component/page name] against the latest Replit designs and report any pixel-perfect deviations`|
| **Deployment Topology** | Deployment configuration | `@deployment-topology Check deployment config` |
| **Environment & Auth** | Secrets and environment setup | `@environment-auth Validate .env and secrets` |
| **Monorepo Boundary** | Cross-boundary violations | `@monorepo-boundary Check for boundary violations` |
| **Observability** | Error monitoring and incidents | `@observability-incident Check Sentry integration` |
| **Plugin Lifecycle** | Feature and plugin management | `@plugin-lifecycle Review plugin schema` |
| **Security & Dependency** | Vulnerability scanning | `@security-dependency Scan for vulnerabilities` |
| **Testing & Release** | Test execution and CI/CD | `@testing-release Run all tests and validate release` |

---

## Key Design Features

### **Hierarchical Orchestration**
The **Meta Orchestrator** sits at the top and can invoke all other agents as subagents. When you invoke the orchestrator, it coordinates reviews across your entire team.

### **Smart Handoffs**
Each agent has handoff buttons that guide the workflow:
- **Lateral handoffs**: Moving between related agents (e.g., Deployment → Environment)
- **Escalation handoffs**: Returning to the orchestrator with results
- **Critical escalations**: Direct-to-orchestrator for blocking issues

### **Tool Assignments**
All agents have access to:
- **`vscode.workspace`**: Read and analyze code
- **`vscode.diagnostics`**: Report issues and lint findings
- **`github`**: Access PR context and merge information

You can expand this by adding MCP servers or extension tools as needed.

### **User-Invocable Design**
All agents are **`user-invocable: true`**, so they appear in the agents dropdown. You can call any agent directly or use the orchestrator for a full team review.

---