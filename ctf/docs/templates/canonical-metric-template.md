# Canonical Metric Definition Template

Use this template when `check_metric_defined` returns `NOT_FOUND` or `AMBIGUOUS`.

## Required Questions

a. Confirm exact metric name and any aliases.
b. Give a precise human-readable description.
c. Specify data_type and unit.
d. Provide calculation logic (SQL, formula, or pseudocode) and required inputs.
e. Provide example inputs with expected output.
f. Specify owner/contact and acceptable thresholds/alerts.
g. Indicate update cadence and retention.

## Canonical Entry Skeleton

```yaml
id: your_metric_id
name: Your Metric Name
description: Clear definition
owner: owner@example.com
data_type: integer|float|percent|currency|datetime
unit: users|usd|percent|...
calculation: |
  SQL or pseudocode
inputs:
  - name: source.field
    type: integer
example_values:
  - 123
last_updated: "2026-02-24T00:00:00Z"
update_cadence: daily|weekly|monthly
retention: 12 months
allowed_thresholds:
  min: 0
  max: 100
  alert_rules:
    - "alert_if_value > 80"
```
