# Revert Protocol: Post-Deployment Incident Response

## Overview

This document defines the **decision tree and runbook** for handling post-deployment issues with metric changes. If something goes wrong after deployment, this protocol ensures fast, safe recovery with minimal impact to 5M users.

**Who executes this**: Observability Agent (detects issues) + You (approves revert)
**When**: Automatically triggered if metric drift, null/NaN values, or permission leakage detected in production
**Goal**: Revert to previous metric definition within 24 hours, with full audit trail

---

## Automatic Detection & Alerting

### What Triggers the Revert Protocol?

The **Observability Agent** continuously monitors production metrics. Any of these conditions trigger an automatic incident:

| Trigger | Threshold | Severity | Action |
|---------|-----------|----------|--------|
| **Metric drift** | >0.01% compared to baseline | CRITICAL | Create incident + notify you |
| **Null/NaN values** | Any null/NaN in critical fields | CRITICAL | Create incident + notify you |
| **Permission leakage** | Any unauthorized data access | CRITICAL | Create incident + notify you |
| **Data loss** | Records missing from pipeline | CRITICAL | Create incident + notify you |
| **Calculation error** | Exception in metric calculation | CRITICAL | Create incident + notify you |
| **Latency degradation** | Metric latency >2x baseline | HIGH | Create incident + notify you |

### Alert Configuration

```json
{
  "alerts": [
    {
      "name": "MetricDriftCritical",
      "condition": "metric_drift > 0.01%",
      "severity": "CRITICAL",
      "action": "page_oncall + create_incident + trigger_revert_decision_tree"
    },
    {
      "name": "NullNaNDetected",
      "condition": "null_or_nan_in_critical_fields",
      "severity": "CRITICAL",
      "action": "page_oncall + create_incident + trigger_revert_decision_tree"
    },
    {
      "name": "PermissionLeakage",
      "condition": "unauthorized_data_access_detected",
      "severity": "CRITICAL",
      "action": "page_oncall + create_incident + trigger_revert_decision_tree"
    }
  ]
}
```

---

## Decision Tree: Should We Revert?

### Step 1: Incident Severity Assessment

```
INCIDENT DETECTED
│
├─ Severity: CRITICAL?
│  ├─ YES → Go to Step 2 (Assess impact)
│  └─ NO → Log + monitor (no revert needed)
│
└─ Examples of CRITICAL:
   ├─ Metric drift >0.01%
   ├─ Null/NaN in critical fields
   ├─ Permission leakage
   └─ Data loss
```

**Questions to answer**:

- Are users seeing incorrect data?
- Is there a data integrity issue?

**If YES to any → CRITICAL → Go to Step 2**

---

### Step 2: Impact Assessment

```
CRITICAL INCIDENT CONFIRMED
│
├─ Question 1: How many users affected?
│  ├─ >100K users → HIGH IMPACT
│  ├─ 10K–100K users → MEDIUM IMPACT
│  └─ <10K users → LOW IMPACT
│
├─ Question 2: Does this affect payouts?
│  ├─ YES (payouts wrong) → HIGH IMPACT → REVERT
│  └─ NO (read-only metric) → Evaluate further
│
├─ Question 3: How long has this been live?
│  ├─ <1 hour → REVERT IMMEDIATELY
│  ├─ 1–6 hours → REVERT (minimize exposure)
│  ├─ 6–24 hours → Evaluate: revert or hot-fix?
│  └─ >24 hours → Evaluate: revert or hot-fix?
│
└─ Question 4: Can we hot-fix in <2 hours?
   ├─ YES → Consider hot-fix (faster than revert)
   └─ NO → REVERT
```

**Impact Matrix**:

| Users Affected | Payouts Affected | Time Live | Decision |
|---|---|---|---|
| >100K | YES | <1 hour | **REVERT IMMEDIATELY** |
| >100K | YES | 1–6 hours | **REVERT** |
| >100K | YES | 6–24 hours | **REVERT** (unless hot-fix ready) |
| >100K | NO | Any | **REVERT** (high visibility) |
| 10K–100K | YES | Any | **REVERT** |
| 10K–100K | NO | <6 hours | **REVERT** |
| 10K–100K | NO | >6 hours | **Evaluate hot-fix** |
| <10K | NO | Any | **Evaluate hot-fix** |

---

### Step 3: Decision: Revert or Hot-Fix?

```
IMPACT ASSESSED
│
├─ Is this a PAYOUT-AFFECTING metric?
│  ├─ YES → REVERT (no exceptions)
│  └─ NO → Continue
│
├─ Are >100K users affected?
│  ├─ YES → REVERT (high visibility)
│  └─ NO → Continue
│
├─ How long has this been live?
│  ├─ <6 hours → REVERT (minimize exposure)
│  └─ >6 hours → Evaluate hot-fix
│
├─ Can we hot-fix in <2 hours?
│  ├─ YES → HOT-FIX (faster recovery)
│  ├─ NO → REVERT
│  └─ UNSURE → REVERT (safer)
│
└─ Final Decision:
   ├─ REVERT → Go to Step 4 (Execute revert)
   └─ HOT-FIX → Go to Step 5 (Execute hot-fix)
```

**Decision Rules**:
- **ALWAYS REVERT if**: Payouts affected OR >100K users affected OR <6 hours live
- **CONSIDER HOT-FIX if**: <10K users affected AND read-only metric AND >6 hours live AND fix ready in <2 hours
- **WHEN IN DOUBT**: REVERT (safety first)

---

## Step 4: Execute Revert

### 4a. Pre-Revert Validation

```
REVERT DECISION MADE
│
├─ [ ] Confirm previous metric definition is available
├─ [ ] Verify rollback procedure is documented
├─ [ ] Confirm database backups exist (if needed)
├─ [ ] Notify affected teams (Observability, Compliance, you)
├─ [ ] Document incident details (what went wrong, when, impact)
└─ → Ready to revert
```

### 4b. Execute Revert

```bash
# 1. Create revert commit
git revert <commit-hash-of-metric-change>

# 2. Verify revert code
# - Revert commit should restore previous metric definition
# - All changes from problematic commit are undone
# - No additional changes introduced

# 3. Fast-track deployment
# - Skip normal CI/CD (emergency revert)
# - Run critical tests only (5-10 minute suite)
# - Deploy to production immediately
# - Monitor for immediate issues

# 4. Verify revert success
# - Metric drift returns to <0.01% of baseline
# - Null/NaN values disappear
# - Permission leakage stops
# - User data returns to correct state
```

### 4c. Revert Validation Checklist

```
REVERT DEPLOYED
│
├─ [ ] Metric drift <0.01% confirmed (within 5 minutes)
├─ [ ] No null/NaN values in critical fields (within 5 minutes)
├─ [ ] No permission leakage (within 5 minutes)
├─ [ ] Users see correct data in UI/API (within 15 minutes)
├─ [ ] No new errors in logs (within 15 minutes)
├─ [ ] Previous metric definition confirmed active (within 15 minutes)
└─ → Revert successful
```

**If any validation fails**:
- Create escalation incident
- Notify compliance and external auditor
- Attempt second revert or manual rollback
- Page on-call engineer

---

## Step 5: Execute Hot-Fix (Alternative to Revert)

### 5a. Hot-Fix Criteria

Hot-fix is **only** acceptable if **ALL** of these are true:
- ✅ <10K users affected
- ✅ Read-only metric (doesn't affect payouts)
- ✅ >6 hours live (some users already saw old data)
- ✅ Fix is ready and tested in <2 hours
- ✅ Fix is simple and low-risk (not a major refactor)

### 5b. Hot-Fix Procedure

```
HOT-FIX DECISION MADE
│
├─ [ ] Root cause identified and documented
├─ [ ] Fix code written and tested locally
├─ [ ] Fix tested against synthetic test suite (5-10 minutes)
├─ [ ] Fix code reviewed (quick review, 15 minutes)
├─ [ ] Revert procedure documented (fallback if hot-fix fails)
├─ [ ] Deploy hot-fix to production
├─ [ ] Monitor metric drift (must return to <0.01%)
├─ [ ] Validate fix success (within 15 minutes)
└─ → Hot-fix successful
```

### 5c. Hot-Fix Validation Checklist

```
HOT-FIX DEPLOYED
│
├─ [ ] Metric drift <0.01% confirmed (within 5 minutes)
├─ [ ] No new null/NaN values introduced (within 5 minutes)
├─ [ ] Fix doesn't introduce new issues (within 15 minutes)
├─ [ ] Users see correct data (within 15 minutes)
├─ [ ] No new errors in logs (within 15 minutes)
└─ → Hot-fix successful
```

**If validation fails**:
- Immediately revert to previous metric definition
- Follow Step 4 (Execute Revert) procedure

---

## Post-Incident: Retrospective & Audit Trail

### 6a. Immediate Actions (Within 1 Hour)

```
INCIDENT RESOLVED (Revert or Hot-Fix)
│
├─ [ ] Incident documented in GitHub issue
├─ [ ] Root cause identified and documented
├─ [ ] Impact assessment completed (how many users affected, for how long)
├─ [ ] Timeline documented (when detected, when fixed, total duration)
├─ [ ] Audit log entry created (immutable record)
└─ → Ready for retrospective
```

### 6b. Retrospective (Within 24 Hours)

```
RETROSPECTIVE ANALYSIS
│
├─ Question 1: Why did the Macro Audit miss this?
│  ├─ Missing synthetic test scenario?
│  ├─ Missing trigger rule?
│  ├─ Missing checklist item?
│  └─ → Update audit process
│
├─ Question 2: Why wasn't it caught in pre-deployment testing?
│  ├─ Test coverage gap?
│  ├─ Test data unrealistic?
│  └─ → Update test suite
│
├─ Question 3: How can we prevent this in the future?
│  ├─ Add synthetic scenario to catch it
│  ├─ Add monitoring/alert to catch it earlier
│  ├─ Add checklist item to verify it
│  └─ → Implement improvements
│
└─ Action Items:
   ├─ [ ] Update synthetic test library (if needed)
   ├─ [ ] Update audit checklist (if needed)
   ├─ [ ] Update trigger rules (if needed)
   ├─ [ ] Update monitoring/alerts (if needed)
   └─ [ ] Document lessons learned
```

### 6c. Audit Log Entry

The incident creates an immutable audit log entry:

```json
{
  "incident_id": "INC-2026-03-26-001",
  "timestamp_detected": "2026-03-26T14:32:00Z",
  "metric_affected": "[METRIC NAME]",
  "trigger": "[METRIC DRIFT / NULL_NAN / PERMISSION_LEAKAGE / DATA_LOSS / CALCULATION_ERROR]",
  "severity": "CRITICAL",
  "users_affected": 5000000,
  "payouts_affected": true,
  "time_to_detection": "5 minutes",
  "decision": "REVERT",
  "action_taken": "Reverted to previous metric definition",
  "timestamp_resolved": "2026-03-26T14:37:00Z",
  "total_duration": "5 minutes",
  "root_cause": "[DESCRIPTION]",
  "why_audit_missed_it": "[DESCRIPTION]",
  "improvements": [
    "Added synthetic scenario for [SCENARIO]",
    "Added monitoring alert for [CONDITION]",
    "Updated checklist item for [ITEM]"
  ],
  "signed_by": "[YOU]",
  "immutable_hash": "sha256:[HASH]"
}
```

---

## Decision Tree Summary (Quick Reference)

```
INCIDENT DETECTED
│
├─ CRITICAL severity? NO → Monitor only
├─ CRITICAL severity? YES → Continue
│
├─ Impact assessment:
│  ├─ Payouts affected? YES → REVERT
│  ├─ >100K users? YES → REVERT
│  ├─ <6 hours live? YES → REVERT
│  ├─ Can hot-fix <2 hours? NO → REVERT
│  └─ All above NO? → Consider hot-fix
│
├─ REVERT path:
│  ├─ Pre-revert validation
│  ├─ Execute revert
│  ├─ Validate revert success
│  └─ Create retrospective
│
├─ HOT-FIX path:
│  ├─ Execute hot-fix
│  ├─ Validate hot-fix success
│  ├─ If validation fails → REVERT
│  └─ Create retrospective
│
└─ POST-INCIDENT:
   ├─ Document incident
   ├─ Root cause analysis
   ├─ Update audit process
   └─ Implement improvements
```

---

## Revert Procedure: Step-by-Step Runbook

### For You (Solo Operator)

#### 1. Receive Alert
```
Observability Agent alerts: "CRITICAL: Metric drift >0.01% detected"
├─ Incident URL: [GITHUB ISSUE]
├─ Metric affected: [METRIC NAME]
├─ Drift amount: [X%]
├─ Users affected: [COUNT]
└─ Time since deployment: [TIME]
```

#### 2. Assess Situation (2 minutes)
```
[ ] Read incident description
[ ] Confirm metric drift is real (not false alarm)
[ ] Check: Does this affect payouts? (YES = REVERT)
[ ] Check: How many users affected? (>100K = REVERT)
[ ] Check: How long has this been live? (<6 hours = REVERT)
[ ] Decision: REVERT or HOT-FIX?
```

#### 3. Execute Revert (5 minutes)
```bash
# Get the commit hash of the problematic change
git log --oneline --grep="metric-change" | head -5

# Create revert commit
git revert <commit-hash>

# Verify revert looks correct
git diff HEAD~1

# Push to main (emergency revert, skip normal review)
git push origin main

# Monitor deployment
# - Deployment should be fast-tracked (5-10 min)
# - Metrics should return to baseline within 5 minutes
```

#### 4. Validate Revert (5 minutes)
```
[ ] Metric drift <0.01% confirmed (check dashboard)
[ ] No null/NaN values (check logs)
[ ] Users see correct data (spot-check a few users)
[ ] No new errors (check error logs)
[ ] Previous metric definition confirmed active
```

#### 5. Create Incident Report (10 minutes)
```
GitHub Issue: "POST-INCIDENT: Metric [NAME] reverted"
├─ Root cause: [DESCRIPTION]
├─ Impact: [X users affected for Y minutes]
├─ Resolution: [Reverted to previous definition]
├─ Time to resolution: [DURATION]
├─ Why audit missed it: [ANALYSIS]
├─ Improvements: [LIST]
└─ Action items: [LIST]
```

#### 6. Schedule Retrospective (Within 24 hours)
```
[ ] Schedule 30-min retrospective meeting
[ ] Review incident timeline
[ ] Analyze why audit missed it
[ ] Identify improvements to audit process
[ ] Implement improvements (update synthetic tests, checklist, triggers)
[ ] Document lessons learned
```

---

## Monitoring & Alerting Configuration

Create a new file: **`.ctf/config/alerts-metrics.json`**

```json
{
  "metric_monitoring": {
    "enabled": true,
    "check_frequency": "real-time",
    "checks": [