# KypeVPN 1.1.0 — Privacy-first Cloudflare WARP client for Windows

KypeVPN is a small, open-source Windows desktop client for **Cloudflare WARP**, built with Electron, React, TypeScript and WireGuard. One click, no account, no telemetry.

**Telegram:** https://t.me/kypezahir

---

## What it is

- A clean desktop interface for Cloudflare's free WARP network.
- Generates an **x25519 WireGuard key on your device**.
- Installs the official WireGuard client if it is missing and brings the tunnel up.
- Verifies the tunnel is really active through `cloudflare.com/cdn-cgi/trace` (`warp=on`).
- Shows the **real exit location** (Cloudflare colo/country) and **real traffic counters** from the Windows adapter.
- English and Portuguese UI, three themes, eight accent colors and window opacity control.

## What it is not

- **Not a VPN provider.** There are no Kype servers.
- **No country selection.** WARP uses anycast IPs, so you always reach the data center nearest to your ISP.
- **No kill switch in this build.** The network is not blocked if the tunnel drops.
- **Not an anonymity network.** Cloudflare terminates the tunnel and can see connection metadata.
- **Not independently audited.** The source is small enough to review, but no third-party audit exists.

---

## Privacy and OpSec

**No account, no identity**
- No email, phone number, signup or token.
- The WARP registration is created directly with Cloudflare from your machine.
- The WireGuard private key is generated locally with Node's `crypto.generateKeyPairSync('x25519')` and never sent to Kype.

**No telemetry**
- No analytics, crash reporting, advertising SDK or auto-updater.
- The only outbound destinations in the main process are:
  - `api.cloudflareclient.com` — WARP registration;
  - `www.cloudflare.com/cdn-cgi/trace` — tunnel verification and exit location;
  - `download.wireguard.com` — official WireGuard MSI, only when WireGuard is not installed.
- No external images, fonts or flag CDNs are loaded by the renderer.

**Hardened renderer**
- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Strict Content-Security-Policy (`default-src 'self'`, no remote scripts, no remote connections)
- Navigation and new windows are blocked.
- The preload exposes only a fixed set of IPC calls; there is no arbitrary command execution.
- The Telegram link is fixed in the main process, so the renderer cannot open arbitrary URLs.

**Local data**
- The WARP config (including the private key) is cached at `%APPDATA%\kypevpn\kypevpn-warp.conf`.
- The file is created with restrictive permissions, but it is still plaintext on disk. Protect your Windows account and disk encryption accordingly.

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

---

## Install (portable)

1. Download `KypeVPN-1.1.0-portable.zip` and extract it.
2. Run `KypeVPN.exe`.
3. Windows SmartScreen may warn because the binary is **not code-signed**. Choose **More info → Run anyway** only if the SHA-256 matches the published hash.
4. Allow the UAC prompt when WireGuard needs to install or start the tunnel.
5. Click the power orb to connect.

On the first run, if WireGuard is not installed, KypeVPN downloads the official MSI from `download.wireguard.com` and installs it after your approval.

---

## Build from source

Requirements: Windows 10/11, Node.js 18+.

```cmd
npm install
npm run build
npx electron .
```

Build a portable ZIP:

```cmd
npm run portable
```

Output: `release/KypeVPN-1.1.0-portable.zip`.

Build an NSIS installer:

```cmd
npm run package
```

Output: `release/KypeVPN Setup 1.1.0.exe`.

Verify the downloaded ZIP:

```powershell
Get-FileHash .\KypeVPN-1.1.0-portable.zip -Algorithm SHA256
```

---

## Customization

**In the app (Settings)**

- **Appearance:** Obsidian, Carbon and Slate themes.
- **Accent color:** eight presets.
- **Window opacity:** 50% to 100%.
- **Language:** English or Portuguese (saved locally).

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

---

## Known limitations

- **Country selection is impossible with WARP.** Anycast routing picks the nearest Cloudflare data center.
- **No kill switch.** If the tunnel drops, traffic can go out directly.
- **Cloudflare sees metadata.** WARP is not a no-log anonymity service.
- **Unsigned build.** Verify the SHA-256 before running.
- **Electron 28 is end-of-life.** Update Electron before large-scale distribution.
- **WARP availability varies.** Some networks block WARP; the app reports an error instead of pretending to be connected.

---

## Release notes — 1.1.0

- Removed the fake country list and the demo "connected" state.
- Removed simulated traffic statistics; counters now come from the real adapter.
- The app now restores the connected state if the tunnel survived a restart.
- Added a bilingual UI (English default, Portuguese option).
- Added the Telegram channel link.
- Hardened the renderer: `sandbox`, strict CSP, navigation blocking, no remote content.
- Removed `webSecurity: false`.
- Preload is copied during the build, so source and binary stay in sync.
- Added MIT `LICENSE` and reproducible portable build script.

---

## License

MIT. See [LICENSE](LICENSE).

**Telegram:** https://t.me/kypezahir
