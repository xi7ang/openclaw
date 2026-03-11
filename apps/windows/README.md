# OpenClaw Windows Desktop App

Native Windows desktop application using Tauri (Rust + Web/TypeScript).

## Status: Proposed

See issue #75 for details.

## Features

- Gateway WebSocket client in Rust
- Device pairing flow UI
- Secure token storage (Windows Credential Manager)
- Chat UI component
- Command invocation system
- Settings/preferences panel
- System tray integration

## Dependencies

- Tauri 2.x
- Rust (Tokio, tokio-tungstenite, keyring)
- React 18.x, TypeScript 5.x, Vite 5.x
