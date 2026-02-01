# NU Posa – Campus Cat Information System

NU Posa is a web-based campus cat information system developed using the MERN stack.

This repository contains part of the NU Posa application and is used for academic and development purposes, including system documentation and security analysis.

Key Management Policy for NU Posa:

Storage: All cryptographic keys (JWT Secrets, Database URIs) are stored exclusively in environment variables (.env) and are never committed to version control (GitHub).

Generation: Keys are generated using cryptographically secure random number generators (e.g., openssl rand -base64 32) rather than manual strings.

Rotation: In the event of a suspected breach, the JWT_SECRET will be rotated immediately, invalidating all active sessions.

Access: Direct access to the production .env file is restricted to the Lead Administrator.