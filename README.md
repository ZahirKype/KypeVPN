# KypeVPN

Cliente de VPN para Windows baseado em **Cloudflare WARP** e **WireGuard**, com interface em React + Electron.

**Telegram:** https://t.me/kypezahir

> **O que este app é:** uma interface para a rede gratuita da Cloudflare WARP. Não é uma VPN própria, não tem servidores por país e não tem conta.
>
> **O que este app não é:** não permite escolher o país de saída e ainda não implementa kill switch.

## Funcionalidades reais

- Conexão com a Cloudflare WARP em um clique.
- Geração de chave WireGuard **no próprio dispositivo** (x25519), sem conta, e-mail ou cadastro.
- Instalação automática do WireGuard oficial, se necessário.
- Verificação real do túnel via `cloudflare.com/cdn-cgi/trace` (`warp=on`).
- Localização real do data center de saída (ex.: `Brasil (FOR)`).
- Estatísticas reais de tráfego, lidas do adaptador do Windows.
- Interface em **inglês e português**, 3 temas, 8 cores de destaque e opacidade da janela.
- Sem telemetria, sem analytics e sem auto-update.
- Mais detalhes, comandos e personalização: [RELEASE.md](RELEASE.md).

## Limitações conhecidas

- **Sem escolha de país.** A WARP usa IPs anycast: você sempre cai no data center mais próximo da sua operadora.
- **Sem kill switch.** O app não bloqueia a rede se o túnel cair. Não confie nele para cenários de alto risco.
- **Metadados.** A Cloudflare encerra o túnel e, como qualquer VPN, vê os destinos acessados.
- **Electron 28 (EOL).** Recomenda-se atualizar antes de distribuir em larga escala.

## Requisitos

- Windows 10/11
- Node.js 18+

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npx electron .
```

## Distribuição

O aplicativo pode ser distribuído **sem credenciais**. Cada usuário gera a própria chave WARP no primeiro uso; não existe conta compartilhada, token ou login para vazar.

```bash
npm run package     # instalador NSIS
npm run portable    # versão portátil
```

## Estrutura

```
src/
├── main/        # processo principal: WARP, WireGuard, IPC
├── preload/     # ponte IPC mínima e isolada
└── renderer/    # interface React
```

## Segurança

- `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`.
- CSP restritiva no `index.html`.
- Superfície IPC limitada a conexão, estado e controles da janela.
- Nenhum recurso remoto carregado pelo renderer.

## Licença

MIT — veja [LICENSE](LICENSE).
