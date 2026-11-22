---
register: journal
---

## 2026-11-22

Initialisation de la mémoire agent locale pour Newsy (`memory-setup`), à l'occasion de l'ajout de deux nouveaux flux de releases GitHub à surveiller (PowerToys, Uptime Kuma) en complément de pyRevit déjà en place. Le `CLAUDE.md` du projet a été créé (contexte, stack, architecture, conventions clés), et les registres `decisions/`, `learnings/`, `blockers/` ont été amorcés avec des entrées réelles issues de l'historique du projet : l'isolation des flux RSS par try/catch individuel (suite à l'incident où un flux cassé bloquait tous les envois), le choix de persister abonnés/articles sur JSON plutôt qu'en base, et le pattern d'ajout d'un flux de releases GitHub via son URL `releases.atom`.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — Isolation des flux RSS par try/catch individuel
- [BLK-001](blockers/BLK-001.md) — Un flux RSS cassé bloquait silencieusement tous les envois
