## Design & Mockups Agent

### Purpose

Manages Replit design submodule and ensures pixel-perfect UI implementation. Eliminates repetitive context-setting for design-to-code workflows.

### Responsibilities

- Pull and sync latest design changes from Replit submodule
- Update command: `git submodule update --init --recursive`
- Implement design mockups with pixel-perfect accuracy
- Audit UI components against design specifications
- Extract and apply design tokens (colors, spacing, typography)
- Validate responsive behavior matches design intent

### Boundaries

- Must not allow UI implementations that deviate from designs
- Enforce pixel-perfect compliance for all visual elements
- Prevent hardcoded values that should use design tokens
- Ensure design-to-code consistency across all components

### Pixel-Perfect Requirements

- Match spacing to 1px precision
- Use design tokens for colors (no hardcoding hex values)
- Maintain aspect ratios for images
- Respect line-height and letter-spacing from designs

### Example Tasks

- Pull the latest design changes from the Replit submodule
- Implement new dashboard layout with pixel-perfect accuracy
- Audit navbar component against latest mockups
- Generate implementation checklist for complex components
- Report visual deviations between code and design

### Design System Context

- **Submodule Path**: `design/`
- **Design Format**:
- **Components Location**: `/design/mockups/artifacts/mockup-sandbox/src/components/mockups/survivor-hub`
- **Framework**: React
- **CSS Approach**:
- **Breakpoints**:
- **Typography Scale**:
---

## Design Agent Integration Guide

### **Three Primary Use Cases**

| Task | Command | What It Does |
|------|---------|--------------|
| **Pull Latest Designs** | `@design Pull the latest design changes from the Replit submodule` | Runs `git submodule update --init --recursive` on the design submodule, updates parent repo pointer, and confirms sync |
| **Implement Mockups** | `@design Implement the latest Replit mockups with pixel-perfect accuracy in [component/page name]` | Analyzes the Replit design files, extracts specs (colors, spacing, typography, layout), and generates implementation code |
| **Audit UI** | `@design Audit [component/page name] against the latest Replit designs and report any pixel-perfect deviations` | Compares current implementation against design specs, identifies misalignments, and provides specific fix instructions |

---

### Integrate with Your Workflow**

**Option A: Standalone Design Reviews**
```
@design Audit the navbar component against the latest Replit mockups
```

**Option B: Full Team Review (via Orchestrator)**
```
@meta-orchestrator Run full team review on this PR, including design audit
```
The orchestrator will automatically invoke the Design Agent as part of the comprehensive check.

---

## Design Agent Capabilities

### **Submodule Management**

- **Status Check**: Verifies submodule is in sync with remote
- **Commit Tracking**: Reports current design commit hash and branch

### **Design Analysis**
- Extracts specifications from mockups (spacing, colors, typography, layout)
- Identifies responsive behavior from designs
- Maps design tokens to implementation values
- Detects inconsistencies between designs and code

### **Implementation Guidance**
- Generates CSS/component code matching design specs
- Provides pixel-perfect spacing and sizing instructions
- Suggests component structure based on design hierarchy
- Creates implementation checklists for complex components

### **Quality Assurance**
- Compares rendered UI against design mockups
- Flags visual regressions and deviations
- Validates responsive behavior
- Checks accessibility (alt text, contrast, etc.)

---

## Example Workflows

### **Workflow 1: New Feature Implementation**
```
1. @design Pull the latest design changes from the Replit submodule
2. @design Implement the new dashboard layout with pixel-perfect accuracy
3. @design Audit the dashboard against the mockups to verify pixel-perfect match
4. @meta-orchestrator Run full team review on this feature branch
```

### **Workflow 2: Design Update Without Code Changes**
```
1. @design Pull the latest design changes
2. @design Report what changed in the designs since last sync
3. [You decide if implementation updates are needed]
4. @design Implement the color palette update across all components
```

### **Workflow 3: Audit Existing UI**
```
1. @design Audit the entire ctf/ UI against the latest Replit designs
2. [Review findings]
3. @design Generate a prioritized list of fixes needed for pixel-perfect compliance
```