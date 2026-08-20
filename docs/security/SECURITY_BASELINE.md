# Avelune — Security baseline

Status: initial baseline, 2026-08-20.

## Principles

1. Security and privacy are design constraints, not release polish.
2. Exposed interfaces are treated as known to attackers.
3. Default deny, least privilege, role separation and fail-closed behavior are required.
4. Collect no personal data when the same function can be delivered without it.
5. Public clients receive only allowlisted state required for their role.
6. Secrets never enter Git, ordinary project documentation, logs, images or build artifacts.
7. Backups are a control only when restoration has been tested.
8. Observability does not implicitly grant write authority.
9. External services are evaluated for necessity, privacy, security and reversibility.
10. Critical security gates block the capability they protect.

## Development gates

- **SEC-G0 — Threat model:** classify assets, data, actors, trust boundaries and abuse cases before a new exposed service.
- **SEC-G1 — Secrets and deployment:** verify secrets handling, runtime permissions, network exposure and secure defaults before first deployment.
- **SEC-G2 — Identity:** qualify authentication, recovery, sessions and server-side authorization before user accounts are enabled.
- **SEC-G3 — Hostile files:** qualify upload/import limits, traversal resistance, isolation and resource controls before file ingestion is enabled.
- **SEC-G4 — Recovery:** off-host protected backup plus a successful restore test before canonical production user data is accepted.
- **SEC-G5 — Supply chain:** SAST/SCA, secret scanning and container/dependency checks must pass before exposed releases.
- **SEC-G6 — Privacy:** document purposes, lawful basis, minimization, retention, rights and processors before public accounts process personal data.
- **SEC-G7 — Verification:** perform a targeted security review against OWASP ASVS Level 2 before privileged administration or significant personal-data processing is enabled.
- **SEC-G8 — Post-deployment:** verify TLS/headers, network exposure, logs/alerts, dependencies and restore capability after deployment.

## Identity and authentication target

- Use a random stable technical `account_id`; do not make email the canonical game identity.
- Prefer passkeys/WebAuthn where practical; require MFA for privileged accounts.
- If passwords exist, store them with a modern adaptive password hash (Argon2id preferred) and never with reversible encryption or fast general-purpose hashes.
- Recovery tokens are random, short-lived and single-use; recovery must not be weaker than normal authentication.
- Prevent account enumeration and apply abuse/rate controls to sign-in, verification and recovery.
- Keep authentication sessions in `HttpOnly`, `Secure`, explicitly `SameSite` cookies; do not store authentication/session tokens in browser local storage.
- Rotate session identifiers after authentication and privilege changes; support server-side revocation.
- Enforce authorization on the server for every object and action with default-deny behavior.

## Personal data

For each data family, record purpose, lawful basis, exact fields, recipients/processors, storage location, active retention, archival rule, deletion/anonymisation rule, backup handling and applicable user rights.

Avoid collecting real names, birth dates, geolocation, advertising identifiers, contact books, device fingerprints or behavioral profiles unless a separately reviewed requirement proves they are necessary.

Security telemetry such as IP address or User-Agent must have an explicit purpose and bounded retention.

## Hostile content and imports

Treat uploaded archives and imported exports as untrusted input. Use allowlisted formats, compressed and expanded-size limits, entry-count and compression-ratio limits, traversal/symlink protections, generated storage names, non-executable storage, resource quotas, isolated parsing and deterministic cleanup.

## Supply chain

The production path should progressively include dependency update automation, vulnerability/SCA checks, SAST, secret scanning, container scanning, an SBOM, locked dependency graphs and immutable image references for critical production images.

## References

- OWASP Application Security Verification Standard (ASVS) 5.0.0.
- OWASP Top 10:2025.
- OWASP Cheat Sheet Series: Authentication, Session Management, Password Storage, File Upload.
- NIST SP 800-63B-4 (2025), Digital Identity Guidelines: Authentication and Authenticator Management.
- CNIL, Guide de la sécurité des données personnelles (2024) and current guidance on minimisation and retention.
- GDPR/RGPD Articles 25, 32, 33 and 34 as applicable.

## Publication boundary

This file intentionally contains no credential values, recovery material, private hostnames or ports, detailed network topology, raw personal data, private world seeds or proprietary secret recipes. Those belong only in their approved restricted stores.
