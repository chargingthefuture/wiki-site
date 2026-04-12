# Codespaces Development Container Setup

## Fast Mode (Default)

Codespaces uses a **fast-mode profile** by default to reduce startup CPU/time overhead:

- `CTF_CODESPACES_FAST_MODE=1`: Skips optional system library installs and startup builds.
- `CTF_SKIP_SENTRY_NEXTJS=1`: Disables Sentry Next.js plugin during builds (saves 20-30% build time).

These are set in `containerEnv` and apply **only at container startup**. Full builds and functionality remain available on-demand.

### Why Fast Mode?

- **Startup time**: ~60-120 seconds faster (skips system library installs, optional build tasks).
- **CPU/memory**: Reduced containerization overhead during Codespaces initialization.
- **Developer experience**: Faster editor readiness without sacrificing build accuracy later.

## Database URLs & Schema Drift Checks

Database URLs are managed via GitHub Actions secrets:

- `DATABASE_URL_STAGING`: Staging environment connection string.
- `DATABASE_URL` (production): Production environment connection string.

### In Codespaces

By default, **schema drift checks are skipped** when `DATABASE_URL` is not set (safe default). To enable schema drift checks against a specific environment:

#### Option 1: Add a Codespaces Secret (Recommended for CI Validation)

1. In your GitHub Codespace, open the terminal.
2. Export the database URL:
   ```bash
   export DATABASE_URL="postgresql://user:password@host/dbname"
   # or for staging:
   export DATABASE_URL="${DATABASE_URL_STAGING}"
   ```
3. Run the build or verify commands:
   ```bash
   cd ctf
   pnpm run verify:web
   ```

#### Option 2: Disable Fast Mode (Full Startup Validation)

If you need full startup validation (including builds and schema checks), disable fast mode before creating the Codespace:

```bash
# In your Codespace terminal, set environment override
export CTF_CODESPACES_FAST_MODE=0
bash .devcontainer/setup.sh
```

**Note**: This re-runs the full setup script; use only when needed (e.g., testing container initialization).

## Extension Management

- **No forced extensions**: The container doesn't auto-install extensions; Codespaces defaults apply.
- **No extension auto-updates**: Extension updates are disabled to reduce background CPU during development.
- **Recommendations suppressed**: Extension recommendation prompts are disabled; all extensions are opt-in.

To install an extension, use the Extensions marketplace in VS Code directly.

## Startup Performance

| Task | Default | With DATABASE_URL |
|------|---------|-------------------|
| Container init | ~2-3 min | ~2-3 min + DB checks |
| CLI tools | Yes | Yes |
| System libraries | Skipped (fast mode) | Skipped (fast mode) |
| Schema drift check | Skipped | Enabled |
| Build tasks | Skipped (fast mode) | Skipped (fast mode) |

## GitHub Actions vs. Codespaces

- **GitHub Actions**: Full environment setup, all builds run, schema checks enabled.
- **Codespaces**: Fast-mode defaults, optional builds, schema checks skipped (unless DATABASE_URL set).

CI always runs full verification via `.github/workflows/rewrite-ci.yml`; Codespaces prioritizes developer UX.

## Debugging Startup Issues

If the container starts but editor is unresponsive:

```bash
# Check available resources
nproc && free -h && df -h

# Monitor active processes
ps aux --sort=-%cpu | head -15

# Check if pnpm install is still running
pgrep -af "pnpm|node" | head -10
```

To return to default fast mode after testing, rebuild the container:

```bash
# In VS Code command palette: "Codespaces: Rebuild Container"
```
