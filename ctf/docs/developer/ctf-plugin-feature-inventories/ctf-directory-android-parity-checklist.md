# Directory Plugin Android Parity Checklist

This checklist tracks Android feature parity for the Directory plugin in the CTF rewrite.

## Parity Audit

| Feature                                          | Android Parity Status | Notes / Ticket Link |
| ------------------------------------------------ | --------------------- | ------------------- |
| Authenticated dashboard/profile (CRUD)           | Partially implemented (UI mocked; backend CRUD required) |                     |
| Directory list and profile discovery             | Implemented (client mock list) |                     |
| Public profile controls (isPublic)               | Partially implemented (UI shows public flag) |                     |
| Public directory projection routes               | Not implemented       |                     |
| Announcement consumption                         | Implemented (mock announcements list) |                     |
| Validation limits (description, selectors, URL)  | Partially implemented (UI validation stubs) |                     |
| Admin profile list/create/update/assign/delete   | Partially implemented (admin UI mocks for list/create/update/delete) |                     |
| Admin announcement list/create/update/deactivate | Implemented (mock announcement list) |                     |
| Admin skills compatibility/selector governance   | Not implemented       |                     |
| Claimed/unclaimed guardrails                     | Not implemented       |                     |
| Post-create public URL display                   | Partially implemented (mock copy URL action) |                     |

_Last updated: 2026-03-26_
