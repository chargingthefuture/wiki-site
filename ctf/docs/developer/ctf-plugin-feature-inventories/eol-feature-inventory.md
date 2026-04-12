# EOL Plugin Feature Inventory

## Core Features
- Modular educational component (optional, updatable)
- Step-by-step wizard for basic will/testament creation (MVP)
- Review and summary before finalization
- Export/print instructions (no storage yet)
- Legal disclaimers and trauma-informed UX

## Planned Features
- Additional document types (advance healthcare directive, POA, etc.)
- Secure document storage (Supabase, future; 50 MB file size limit per file)
- Trusted contact and emergency access (future)

## Compliance & Safety
- All flows trauma-informed and privacy-first
- Clear legal disclaimers and warnings
- No data storage until Supabase integration is complete

## Documentation
- README with usage and compliance notes
- Legal and trauma-informed design notes

## Educational Module Integration
- Uses shared `@ctf/plugin-education` system
- Content in Markdown, updatable without code changes
- Always skippable, never blocks access to main features
