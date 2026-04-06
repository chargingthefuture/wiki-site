# Synthetic Test Library: 5M-Person Economy Validation

## Overview

This document defines the synthetic test scenarios that the **Metrics & Data Integrity Agent** runs for every metric change. These tests simulate 5M users in various economic conditions to catch silent failures before they reach production.

**Goal**: Ensure metric correctness across normal, extreme, and edge-case scenarios.

---

## Test Scenario 1: Normal Distribution

### Purpose

Validate that metrics work correctly under normal, expected conditions.

### Setup

- **User count**: 5,000,000
- **Income distribution**: Normal distribution (μ=$500/month, σ=$150)
- **Activity pattern**: Normal distribution (μ=20 transactions/month, σ=5)
- **Data volume**: 100M transactions

### Success Criteria

- ✅ All metrics calculate without error
- ✅ Metric values within expected range (e.g., GDP between $2.5B–$2.6B)
- ✅ No null/NaN values in critical fields
- ✅ Aggregation matches expected totals (within ±0.001%)
- ✅ Time-series continuity maintained (no gaps)

### Example Validation

```python
# Pseudocode
def test\_normal\_distribution():
    users = generate\_users(5\_000\_000, income\_mean=500, income\_std=150)
    transactions = generate\_transactions(users, activity\_mean=20, activity\_std=5)

    # Calculate metrics
    total\_gdp = sum(user.income for user in users)
    workforce\_count = len(users)
    avg\_income = total\_gdp / workforce\_count

    # Validate
    assert 2\_500\_000\_000 <= total\_gdp <= 2\_600\_000\_000, "GDP out of expected range"
    assert workforce\_count == 5\_000\_000, "Workforce count mismatch"
    assert 490 <= avg\_income <= 510, "Average income out of range"
    assert no\_null\_values(metrics), "Null values detected"
    assert no\_duplicates(transactions), "Duplicate transactions"
```
