---
title: curiocat
summary: Turns any text into an evidence-grounded causal graph with propagated beliefs — then benchmarks itself honestly, including the results that didn't go its way.
date: 2026-03-11
category: causal-inference
tags: [python, causal-inference, llm, forecasting, networkx, d3.js]
github: https://github.com/coolgenerator/CurioCat
featured: true
ascii: |
  claim ──0.7──▶ claim
    │              │
   0.4            0.6
    ▼              ▼
   belief 0.62 ± 0.08
---

**Role**: solo project — research, backend, frontend. Open source under MIT.

## What it does

Paste a policy brief, a startup pitch or a news event. CurioCat breaks it into atomic claims, infers the cause-and-effect links between them, grounds every link in web evidence, and shows the result as an interactive causal graph. You can see *why* one thing leads to another, *how strong* the evidence is, and *what happens if* an assumption changes.

![CurioCat causal graph: 77 claims and their causal links, with a claims list and an effects panel](/projects/curiocat/en-graph-basic.jpg)

## The pipeline

1. **Claim decomposition.** An LLM extracts atomic claims labelled FACT / ASSUMPTION / PREDICTION / OPINION, each with a confidence and the verbatim source sentence.
2. **Causal link inference.** Embedding similarity filters candidate pairs first; the LLM then judges direction, mechanism and strength. Validation gates reject edges with an empty or restated mechanism, or extreme strengths.
3. **Bias audit.** Eight cognitive biases (correlation ≠ causation, survivorship, reverse causality, …) penalise an edge's strength.
4. **Adversarial evidence.** Each link is searched for both supporting *and* contradicting evidence, scored for relevance, source credibility and domain diversity.
5. **Discovery layers.** New claims found in the evidence are de-duplicated (cosine ≥ 0.95), web-verified and added; inference reruns only on pairs touching a new claim, until the graph converges.
6. **Statistical validation.** If the user uploads metric data, Granger tests tag each LLM edge as *confirmed*, *unsupported* or *contradicted*.
7. **Belief propagation.** A DAG is built with cycle breaking and weak-edge pruning; Noisy-OR propagates beliefs in topological order, modulated by evidence quality, with perturbation-based uncertainty intervals on every node. An edge with no evidence contributes zero belief, not 50%.

![Focus mode: one claim's causal neighbourhood highlighted, with confidence, belief score and temporal position](/projects/curiocat/en-graph-focus.jpg)

## Then I tried to break it

A causal graph that *looks* convincing proves nothing, so I tested whether it could beat simple baselines on questions with known answers.

**Forecasting real prediction markets.** On 60 Polymarket questions that settled after the model's training cutoff, using news retrieved strictly before each snapshot (Google's `before:` operator leaks — it returned articles from eight months later — so every item is re-checked against its own publication date):

| Forecaster | Brier ↓ |
|---|---|
| market price | **0.2293** |
| raw LLM | 0.2583 |
| causal decomposition, log-odds | 0.3897 |
| causal decomposition, Noisy-OR | 0.4121 |

Recalibration (Platt) recovers most of the gap — but the ablation is decisive: a reference-class base rate alone scores 0.2567 after calibration, the full decomposition 0.2572. **The causal drivers carried no information beyond the prior.** Trading returns looked positive but were flagged fragile: removing the single best trade takes the raw LLM from 17.4% to 3.8%.

**A leakage bug in my own evaluation.** A Platt correction looked like a win under random 5-fold CV and vanished under leave-one-source-out: it had been learning per-source calibration from the held-out rows' siblings. That became an automatic check for grouped-data leakage.

**A benchmark auditor.** I packaged eight checks that look for a boring explanation before a number gets reported — does a constant predictor do as well, is the gap inside its own bootstrap noise, does a return survive dropping its best position, did anything settle before the model's cutoff. Validated by replaying defects found by hand earlier: it rediscovered **8/8**, including two the manual pass had missed.

**Auditing a public leaderboard.** Run on [ForecastBench](https://www.forecastbench.org/): on the tournament board, the top 43 entries all have confidence intervals overlapping the leader's, so their rank order isn't established. Extremizing the leading superforecaster median improves Brier from 0.1223 to 0.1148 (95% CI [-0.0138, -0.0009]) on the 521 dataset-type questions — but adding the 57 market questions erases the gain, so the claim is scoped to dataset questions only.

**Choosing a causal-discovery method from the data.** For uploaded data, a router picks between PC, FCI, DAGMA and Granger using bootstrap stability, scale robustness and disagreement with a variance-ordering baseline — and refuses to answer when nothing clears the bar. It scores 0.958 on a synthetic suite against 0.847 for the best fixed method. On two real datasets with published graphs (Sachs protein signalling, Huawei network alarms), however, the variance-ordering control beats every method — reproducing a known critique of causal-discovery benchmarks — and one rule that had helped on synthetic data hurt on real data, so it ships turned off.

## What I learned

Every positive result in this project came from machinery that decides **when not to trust an answer**, not from the causal inference itself. Writing down the negative results — and narrowing claims to exactly where they were measured — made the project more useful, not less.

## Stack

FastAPI · SQLAlchemy (async) · PostgreSQL + pgvector · OpenAI / Anthropic · Brave Search · NetworkX · SciPy · causal-learn · DAGMA · React 19 · D3.js · Tailwind · SSE / WebSocket · Docker Compose
