# KypeVPN 1.1.0 — Privacy-first Cloudflare WARP client for Windows

A small, open-source Windows desktop client for **Cloudflare WARP**, built with Electron, React, TypeScript and WireGuard. One click. No account. No telemetry.

**Telegram:** https://t.me/kypezahir

**Download:** `KypeVPN-1.1.0-portable.zip` (102.6 MB)

**SHA-256:**
```
5FFCE82DC9BD1C34141B1705DFB194D4AFA97C64DF734B4BA3CE0DDB590EAFC9
```

---

## Why this exists

Most "free VPN" clients ask for an account, ship analytics, or pretend to connect when they are not connected. KypeVPN does the opposite: it is a focused GUI for Cloudflare's free WARP network, and it only reports what it can verify.

- The WireGuard key is generated **on your device**.
- The tunnel is verified through `cloudflare.com/cdn-cgi/trace` (`warp=on`).
- The exit location and traffic counters are **real**, not simulated.
- If WARP is blocked or the tunnel fails, the app shows an error instead of a fake green light.

## Features

- One-click connect / disconnect to Cloudflare WARP.
- Automatic WireGuard installation (official MSI) when needed.
- Real exit data center and country (e.g. `Brazil (FOR)`).
- Real download / upload / session statistics from the Windows adapter.
- Restores the connected state if the tunnel survived an app restart.
- **English and Portuguese UI** (English by default).
- Three themes, eight accent colors, window opacity control.
- Telegram channel shortcut.
- No account, no email, no signup, no token.
- No analytics, no crash reporting, no advertising, no auto-updater.

## Privacy and OpSec

**Local-first identity**
- The x25519 WireGuard private key is generated locally with Node's `crypto.generateKeyPairSync('x25519')` and is never sent to Kype.
- The WARP registration is created directly between your machine and Cloudflare.
- No Kype server is involved at any point.

**No telemetry**
- No analytics, crash reporting, or tracking SDK.
- The only outbound destinations in the main process are:
  - `api.cloudflareclient.com` — WARP registration;
  - `www.cloudflare.com/cdn-cgi/trace` — tunnel verification and exit location;
  - `download.wireguard.com` — official WireGuard MSI, only if WireGuard is not installed.
- The renderer loads no remote images, fonts, scripts, or flag CDNs.

**Hardened renderer**
- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Strict CSP (`default-src 'self'`, no remote scripts, no remote connections)
- Navigation and new windows are blocked.
- The preload exposes only a fixed set of IPC calls.
- The Telegram URL is fixed in the main process, so the renderer cannot open arbitrary URLs.

**Local data**
- The WARP config, including the private key, is cached at `%APPDATA%\kypevpn\kypevpn-warp.conf`.
- It is created with restrictive permissions, but it is still plaintext on disk. Use Windows account protection and disk encryption.

**Verify it yourself**

```powershell
# 1. Look for telemetry / analytics libraries
Select-String -Path src\**\*.ts,src\**\*.tsx -Pattern "analytics|sentry|telemetry|posthog|segment"

# 2. List every outbound host in the main process
Select-String -Path src\main\index.ts -Pattern "https://|hostname:"

# 3. Check the live tunnel (administrator shell)
& "C:\Program Files\WireGuard\wg.exe" show kypevpn-warp

# 4. Confirm WARP is active
curl.exe -s https://www.cloudflare.com/cdn-cgi/trace
# look for: warp=on
```

## Install (portable)

1. Download `KypeVPN-1.1.0-portable.zip` and verify the SHA-256.
2. Extract the ZIP.
3. Run `KypeVPN.exe`.
4. Windows SmartScreen may warn because the binary is **not code-signed**. Choose **More info → Run anyway** only if the hash matches.
5. Allow the UAC prompt when WireGuard needs to install or start the tunnel.
6. Click the power orb to connect.

On first run, if WireGuard is missing, KypeVPN downloads the official MSI from `download.wireguard.com` and installs it after your approval.

## Build from source

Requirements: Windows 10/11, Node.js 18+.

```cmd
npm install
npm run build
npx electron .
```

Build the portable ZIP:

```cmd
npm run portable
```

Output: `release/KypeVPN-1.1.0-portable.zip`

Build an NSIS installer:

```cmd
npm run package
```

Output: `release/KypeVPN Setup 1.1.0.exe`

Verify the ZIP:

```powershell
Get-FileHash .\KypeVPN-1.1.0-portable.zip -Algorithm SHA256
```

## Customization

**In the app (Settings)**

- **Appearance:** Obsidian, Carbon, Slate.
- **Accent color:** eight presets.
- **Window opacity:** 50% to 100%.
- **Language:** English or Portuguese (persisted locally).

**In the code**

| What | Where |
|---|---|
| Theme colors | `src/renderer/App.tsx` → `THEMES` |
| Accent colors | `src/renderer/App.tsx` → `ACCENTS` |
| UI strings (EN/PT) | `src/renderer/i18n.ts` |
| Default language | `src/renderer/App.tsx` → `useState<Lang>` |
| App name and version | `package.json` |
| Window icon | `build/icon.png` |
| Telegram link | `src/main/index.ts` → `open-telegram` |
| Tunnel name | `src/main/index.ts` → `TUNNEL_NAME` |
| WARP endpoint | `src/main/index.ts` → `engage.cloudflareclient.com:2408` |

After any change:

```cmd
npm run build
npm run portable
```

## Known limitations

- **No country selection.** WARP uses anycast IPs, so you always reach the data center nearest to your ISP.
- **No kill switch.** If the tunnel drops, traffic can go out directly.
- **Cloudflare sees metadata.** WARP is not a no-log anonymity service.
- **Unsigned build.** Verify the SHA-256 before running.
- **Electron 28 is end-of-life.** Update Electron before large-scale distribution.
- **WARP availability varies.** Some networks block WARP; the app reports an error instead of pretending to be connected.
- **Not independently audited.** The source is small, but no third-party audit exists.

## Release notes — 1.1.0

- Removed the fake country list and the demo "connected" state.
- Removed simulated traffic statistics; counters now come from the real adapter.
- Restores the connected state if the tunnel survived a restart.
- Added a bilingual UI (English default, Portuguese option).
- Added the Telegram channel link.
- Hardened the renderer: `sandbox`, strict CSP, navigation blocking, no remote content.
- Removed `webSecurity: false`.
- Preload is copied during the build, so source and binary stay in sync.
- Added MIT `LICENSE` and a reproducible portable build script.

## License

MIT. See `LICENSE`.

**Telegram:** https://t.me/kypezahir
