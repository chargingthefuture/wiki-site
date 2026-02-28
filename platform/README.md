[![Platform Release](https://github.com/chargingthefuture/app/actions/workflows/platform-release.yml/badge.svg)](https://github.com/chargingthefuture/app/actions/workflows/platform-release.yml)

# Structure

```
shared/schema/
├── schema.ts                    # Main file with re-exports (519 lines)
├── validation/
│   └── common.ts               # ✅ Common validation schemas
├── core/
│   ├── users.ts               # ✅ User and auth tables
│   ├── payments.ts            # ✅ Payments and pricing tiers
│   ├── admin.ts               # ✅ Admin logs
│   └── profile-deletion.ts    # ✅ Profile deletion logs
└── [mini-app directories]/    # ✅ All 15 mini-app schemas extracted
    ├── supportmatch/
    ├── lighthouse/
    ├── socketrelay/
    ├── directory/
    ├── skills/
    ├── trusttransport/
    ├── gentlepulse/
    ├── chyme/
    ├── workforcerecruitertracker/
    ├── defaultaliveordead/
```

## All Extracted Modules

### Core Modules
- ✅ `core/users.ts` - User and authentication tables
- ✅ `core/payments.ts` - Payments and pricing tiers
- ✅ `core/admin.ts` - Admin action logs
- ✅ `core/profile-deletion.ts` - Profile deletion audit trail
