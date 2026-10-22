---
title: luvio
summary: An open-source, agent-driven CRM. Agents find and research companies, then propose edits with sources and confidence — nothing lands until a human approves it.
date: 2026-09-08
category: ai-agents
tags: [python, go, llm-agents, nl2sql, pgvector, litellm, tauri]
# 仓库公开后取消注释：
# github: https://github.com/Luviocc/luvio-crm
demo: https://luvio.cc
featured: true
ascii: |
  agent ─▶ proposal ─▶ [review]
   field   industry
   old→new  —  → SaaS
   conf 0.86   src ↗   [✓] [✗]
---

**Role**: founder & sole developer — product, architecture, backend, data/AI and frontend.

**Status**: live at [luvio.cc](https://luvio.cc), self-hostable, AGPL-3.0. ~100k lines of Python and 1,100+ tests.

## Problem

CRMs depend on people typing records into forms, so the data is always incomplete and stale. Bolting an LLM on top makes it worse in a different way: a model that writes straight into the database will eventually overwrite good data with a confident hallucination, and nobody can tell which field came from where.

Luvio starts from the opposite premise: **the records should be a by-product of the work**, and every automated change should be reviewable and traceable.

## What it does

- **Finds leads itself.** Drives a real browser over Google Maps and reads Reddit through its API; an LLM scores each lead's fit and gives a one-line reason.
- **Proposes, never overwrites.** Each suggestion records the field, old and new value, a confidence score and the source URL. A human approves or rejects it in a review queue.
- **Ask your data in plain language.** Natural-language questions become read-only SQL through a semantic layer, instead of pasting a table dump into a prompt.
- **Writes outreach it can back up.** Account briefs and email drafts may only state facts that cite collected evidence.
- **Bring your own model.** ~140 providers through LiteLLM — OpenAI, Anthropic, Bedrock, Vertex, or a local Ollama / vLLM — with per-model, per-day spend shown in settings.

## Data & AI design

**Grounded generation.** For account briefs, code collects numbered evidence (`E1`, `E2`, …) and the model must cite an evidence ID for every claim. Claims with missing or invented citations are dropped and counted, and code — not the model — resolves citations to URLs, so a URL can never be hallucinated.

**LLM-as-judge that fails closed.** Every outbound draft goes through deterministic checks first, then a judge model scores it against the allowed facts. Anything uncertain is routed to a human; auto-send requires a score above a threshold.

**A built-in experiment.** Once a workspace has 20 emails that drew interested replies, three are shown to the writer model as style exemplars. Each enrollment is hashed into an *exemplars* or *holdout* arm (50/50 by default), and the outcome funnel compares the two — so the feature measures its own lift instead of assuming it.

**Natural language to SQL.** A registry of entities and metrics (with SQL templates and a changelog) feeds the prompt, with few-shot examples pulled from the database and a schema fallback. A validator only lets read-only queries through by default.

**Agent memory.** Two tiers: a cheap name-and-description index goes into every prompt, full content is fetched on demand through a `recall_memory` tool. After each turn a small model extracts durable facts, which are de-duplicated by name and then by embedding similarity (pgvector), and routed by confidence — auto-accepted or queued for review.

**Cheap rules before expensive models.** Reply triage catches unsubscribes and auto-replies with patterns and only sends the rest to an LLM; lead de-duplication matches on Google place ID, then a fingerprint of name and location, then email and phone.

**Causal marketing-mix engine (R&D).** Geometric adstock, Hill saturation, a structural causal model, counterfactual decomposition and a budget optimizer, validated with refutation tests (placebo treatment, random common cause, data subset, time holdout). Implemented and unit-tested; not yet wired into the product.

## Architecture

```text
           ┌──────────── frontend (web) ────────────┐
           │                                        │
   ┌───────▼────────┐                     ┌─────────▼──────────┐
   │ Go control     │  state & policy     │ Python data plane  │
   │ plane          │◀───────────────────▶│ agents · LLMs      │
   │ CRUD · auth ·  │   MCP tool gateway  │ nl2sql · memory ·  │
   │ RBAC · tenancy │                     │ sourcing · enrich  │
   │ audit · events │                     │ prospecting        │
   └───────┬────────┘                     └─────────┬──────────┘
           │        Postgres 18 + pgvector          │
           └──────────────────┬─────────────────────┘
                              │
                  desktop (Tauri): signed playbooks run
                  in the user's own logged-in browser
```

- **A hard Go / Python boundary.** Go owns state and policy; Python owns anything that calls a model, and reaches the workspace API through an MCP tool gateway. CI enforces the split: the Python service may not mount an API prefix the route-ownership document doesn't list.
- **Every change is a fact.** Each write to a company, person or opportunity emits an immutable, field-level event recording who made it and through which path. Stage history and time-in-stage are derived from that stream, not from snapshots.
- **Shared directory, private pipeline.** `companies` is a shared, fingerprint-keyed directory with confirmation counts and freshness; `tenant_companies` holds each workspace's pipeline; `data_contributions` records where every field came from.

## What I learned

Putting an LLM in a business workflow is mostly a **data-provenance problem**, not a prompting problem. Once every value carries its source, confidence and author, review queues, audit trails and pipeline analytics all fall out of the same event log.

## What's next

Quality is enforced at runtime today — citation checks, the judge, confidence routing and the holdout experiment. The next step is an **offline evaluation set** for briefs, drafts and NL-to-SQL, so model and prompt changes can be compared before they ship.

## Background

Luvio started in 2025 as *ProjectUp*, a project-collaboration tool with hybrid BM25 + vector retrieval (reciprocal rank fusion and a reranker) and a knowledge graph extracted from team chats. In early 2026 it became an analytics and sales-agent platform, and in September 2026 seven repositories were consolidated into today's open-source CRM.
