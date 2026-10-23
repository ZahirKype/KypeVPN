# KypeVPN 1.1.0 — Cliente Cloudflare WARP para Windows com foco em privacidade

Um cliente desktop pequeno e de código aberto para o **Cloudflare WARP** no Windows, feito com Electron, React, TypeScript e WireGuard. Um clique. Sem conta. Sem telemetria.

**Telegram:** https://t.me/kypezahir

**Download:** `KypeVPN-1.1.0-portable.zip` (102,6 MB)

**SHA-256:**
```
5FFCE82DC9BD1C34141B1705DFB194D4AFA97C64DF734B4BA3CE0DDB590EAFC9
```

---

## Por que ele existe

A maioria dos clientes "VPN grátis" pede conta, inclui analytics ou finge que conectou quando não conectou. O KypeVPN faz o contrário: é uma interface focada na rede gratuita da Cloudflare WARP e só mostra o que consegue verificar.

- A chave WireGuard é gerada **no seu dispositivo**.
- O túnel é verificado via `cloudflare.com/cdn-cgi/trace` (`warp=on`).
- A localização de saída e os contadores de tráfego são **reais**, não simulados.
- Se a WARP estiver bloqueada ou o túnel falhar, o app mostra erro em vez de um sinal verde falso.

## Recursos

- Conexão e desconexão da Cloudflare WARP em um clique.
- Instalação automática do WireGuard oficial (MSI) quando necessário.
- Data center e país de saída reais (ex.: `Brasil (FOR)`).
- Estatísticas reais de download, upload e sessão lidas do adaptador do Windows.
- Restaura o estado conectado se o túnel sobreviveu a um reinício do app.
- **Interface em inglês e português** (inglês por padrão).
- Três temas, oito cores de destaque e controle de opacidade da janela.
- Atalho para o canal do Telegram.
- Sem conta, sem e-mail, sem cadastro, sem token.
- Sem analytics, sem relatório de erros, sem publicidade, sem auto-update.

## Privacidade e OpSec

**Identidade local**
- A chave privada x25519 do WireGuard é gerada localmente com `crypto.generateKeyPairSync('x25519')` do Node e nunca é enviada para a Kype.
- O registro na WARP é feito diretamente entre a sua máquina e a Cloudflare.
- Nenhum servidor da Kype participa do processo.

**Sem telemetria**
- Sem analytics, relatório de erros ou SDK de rastreamento.
- Os únicos destinos externos no processo principal são:
  - `api.cloudflareclient.com` — registro na WARP;
  - `www.cloudflare.com/cdn-cgi/trace` — verificação do túnel e localização de saída;
  - `download.wireguard.com` — MSI oficial do WireGuard, somente se ele não estiver instalado.
- O renderer não carrega imagens, fontes, scripts ou bandeiras de CDNs externos.

**Renderer endurecido**
- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- CSP estrita (`default-src 'self'`, sem scripts remotos, sem conexões remotas)
- Navegação e abertura de novas janelas bloqueadas.
- O preload expõe apenas um conjunto fixo de chamadas IPC.
- A URL do Telegram é fixa no processo principal, então o renderer não consegue abrir URLs arbitrárias.

**Dados locais**
- A configuração da WARP, incluindo a chave privada, fica em `%APPDATA%\kypevpn\kypevpn-warp.conf`.
- O arquivo é criado com permissões restritas, mas continua em texto puro no disco. Use proteção de conta do Windows e criptografia de disco.

**Verifique você mesmo**

```powershell
# 1. Procure bibliotecas de telemetria / analytics
Select-String -Path src\**\*.ts,src\**\*.tsx -Pattern "analytics|sentry|telemetry|posthog|segment"

# 2. Liste todos os hosts externos no processo principal
Select-String -Path src\main\index.ts -Pattern "https://|hostname:"

# 3. Veja o túnel ativo (shell como administrador)
& "C:\Program Files\WireGuard\wg.exe" show kypevpn-warp

# 4. Confirme que a WARP está ativa
curl.exe -s https://www.cloudflare.com/cdn-cgi/trace
# procure por: warp=on
```

## Instalação (portátil)

1. Baixe `KypeVPN-1.1.0-portable.zip` e confira o SHA-256.
2. Extraia o ZIP.
3. Execute `KypeVPN.exe`.
4. O SmartScreen do Windows pode avisar porque o binário **não é assinado**. Escolha **Mais informações → Executar assim mesmo** somente se o hash bater.
5. Autorize o UAC quando o WireGuard precisar instalar ou iniciar o túnel.
6. Clique no botão de energia para conectar.

Na primeira execução, se o WireGuard não estiver instalado, o KypeVPN baixa o MSI oficial de `download.wireguard.com` e instala após a sua aprovação.

## Compilar do código-fonte

Requisitos: Windows 10/11, Node.js 18+.

```cmd
npm install
npm run build
npx electron .
```

Gerar o ZIP portátil:

```cmd
npm run portable
```

Saída: `release/KypeVPN-1.1.0-portable.zip`

Gerar o instalador NSIS:

```cmd
npm run package
```

Saída: `release/KypeVPN Setup 1.1.0.exe`

Conferir o ZIP:

```powershell
Get-FileHash .\KypeVPN-1.1.0-portable.zip -Algorithm SHA256
```

## Personalização

**No app (Ajustes)**

- **Aparência:** Obsidian, Carbon e Slate.
- **Cor de destaque:** oito opções.
- **Opacidade da janela:** 50% a 100%.
- **Idioma:** inglês ou português (salvo localmente).

**No código**

| O quê | Onde |
|---|---|
| Cores dos temas | `src/renderer/App.tsx` → `THEMES` |
| Cores de destaque | `src/renderer/App.tsx` → `ACCENTS` |
| Textos da interface (EN/PT) | `src/renderer/i18n.ts` |
| Idioma padrão | `src/renderer/App.tsx` → `useState<Lang>` |
| Nome e versão do app | `package.json` |
| Ícone da janela | `build/icon.png` |
| Link do Telegram | `src/main/index.ts` → `open-telegram` |
| Nome do túnel | `src/main/index.ts` → `TUNNEL_NAME` |
| Endpoint da WARP | `src/main/index.ts` → `engage.cloudflareclient.com:2408` |

Depois de qualquer alteração:

```cmd
npm run build
npm run portable
```

## Limitações conhecidas

- **Sem escolha de país.** A WARP usa IPs anycast, então você sempre chega ao data center mais próximo da sua operadora.
- **Sem kill switch.** Se o túnel cair, o tráfego pode sair direto.
- **A Cloudflare vê metadados.** A WARP não é um serviço de anonimato sem logs.
- **Build não assinado.** Confira o SHA-256 antes de executar.
- **Electron 28 está em fim de vida.** Atualize o Electron antes de distribuir em larga escala.
- **Disponibilidade da WARP varia.** Algumas redes bloqueiam a WARP; o app mostra erro em vez de fingir que conectou.
- **Sem auditoria independente.** O código é pequeno, mas não existe auditoria de terceiros.

## Notas da versão — 1.1.0

- Removida a lista falsa de países e o estado "conectado" de demonstração.
- Removidas as estatísticas simuladas; os contadores agora vêm do adaptador real.
- O app restaura o estado conectado se o túnel sobreviveu a um reinício.
- Adicionada interface bilíngue (inglês padrão, português opcional).
- Adicionado o link do canal do Telegram.
- Renderer endurecido: `sandbox`, CSP estrita, bloqueio de navegação, sem conteúdo remoto.
- Removido `webSecurity: false`.
- O preload é copiado durante o build, mantendo código-fonte e binário em sincronia.
- Adicionada `LICENSE` MIT e script reproduzível de build portátil.

## Licença

MIT. Veja `LICENSE`.

**Telegram:** https://t.me/kypezahir
