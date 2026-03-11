# Proposal: Linux/Windows Desktop Client Applications

## Summary

Create native Linux and Windows desktop client applications using Tauri (Rust + Web/TypeScript), enabling users to connect to OpenClaw Gateway as a node.

## Problem

OpenClaw currently supports macOS, iOS, and Android clients, but lacks native desktop applications for Linux and Windows users.

## Solution

Implement cross-platform desktop clients using Tauri:
- Native performance with Rust backend
- Smaller binary sizes compared to Electron
- Cross-platform support from a single codebase

## Implementation Phases

### Phase 1: Foundation
- Set up Tauri scaffolding for Linux and Windows
- Implement Gateway WebSocket client in Rust
- Create device pairing flow UI
- Add secure token storage

### Phase 2: Core Features
- Chat UI component for messaging
- Command invocation system
- Settings/preferences panel
- System tray integration

### Phase 3: Advanced Features
- Canvas/A2UI WebView support
- Voice output (TTS)
- Desktop notifications
- Clipboard integration

### Phase 4: Platform-Specific
- Linux: D-Bus integration
- Windows: Notification center integration
- Auto-start on login

## Related

- Existing apps: `apps/macos/`, `apps/ios/`, `apps/android/`
- Gateway protocol: `src/gateway/protocol/`

**Related Issue:** #75
