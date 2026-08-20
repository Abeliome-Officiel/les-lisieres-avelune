# Avelune — Security

This directory is the shareable security-governance space for Avelune.

It contains requirements, security gates, threat-model outcomes and development guidance that are safe to keep with the project source. It must never contain credentials, recovery codes, private seeds, secret values, private network topology, raw personal-data exports, or proprietary mechanisms whose disclosure is unnecessary to understand the control.

## Sources of truth

- The private security register and operational evidence remain in the restricted Avelune security space on Drive / the physical vault as appropriate.
- This directory contains only the shareable security baseline.
- Runtime credentials belong in the approved secret-management mechanism, never in Git.

## Operating rule

Any new exposed surface, new personal-data category, new secret, canonical write capability, file import, privileged administrative action, sensitive external dependency, or authentication change triggers a security review before activation.

A critical security gate that is not closed blocks the corresponding capability.

See `SECURITY_BASELINE.md`.
