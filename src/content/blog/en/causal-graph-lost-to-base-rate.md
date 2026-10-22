---
title: My causal graph lost to the base rate
description: I built an LLM pipeline that breaks a forecast into causal drivers. On 60 real prediction markets, one number — the base rate — did just as well, and a coin flip did better than both.
date: 2026-10-22
tags: [causal-inference, forecasting, llm, evaluation]
draft: true
---

**TL;DR**

- I asked whether decomposing a question into causal drivers makes an LLM a better forecaster. On 60 prediction markets that settled after the model's training cutoff, it made it worse.
- After recalibration, a forecast built from the model's base rate alone scored the same as the full causal decomposition. The drivers carried no information beyond the prior.
- Nothing built from the model alone beat saying "50%" on every question. Only the market did.

## The idea

[CurioCat](/projects/curiocat/) turns text into a causal graph: claims, the links between them, evidence for each link, and beliefs propagated through the graph. The obvious next question was whether that structure helps you *predict* anything.

So I gave it binary questions — "Will Japan win on 2026-06-21?" — and asked it to decompose each one. For every question the model produces a reference-class base rate and around five drivers, each with a direction (supports or inhibits), a strength, a probability and an evidence score. Two combiners turn that into a forecast from the *same* decomposition, so any difference between them is the combining rule, not model noise:

- **Noisy-OR** — the belief propagation the rest of the app uses.
- **Log-odds** — start from the base rate and let each driver shift it, weighted by its evidence.

The baseline is simply asking the model for a probability.

## The test

Prediction markets are a good benchmark because they settle and they have a price: a crowd's forecast you have to beat.

- **60 Polymarket questions that settled after June 1, 2026**, beyond the model's training cutoff, so it can't remember the answer.
- **News retrieved strictly before each snapshot.** Google's `before:` operator is not a guarantee — asked for articles before 2025-06-01, it returned one published eight months later — so every article is re-checked against its own publication date and dropped if it's too new.
- **Questions sampled at random, not by volume.** Taking the highest-volume markets oversamples upsets and makes the market look worse than it is.

## Results

Brier score, lower is better:

| Forecaster | Brier |
|---|---|
| market price | **0.2293** |
| always say 50% | 0.2500 |
| ask the LLM directly | 0.2583 |
| causal decomposition, log-odds | 0.3897 |
| causal decomposition, Noisy-OR | 0.4121 |

The decomposition didn't just fail to help. It was the worst thing on the table, by a wide margin.

## What went wrong

The calibration table tells most of the story. The Noisy-OR forecast put **43 of the 60 questions below 20%** — and **51% of those resolved YES**. On average it predicted 18% for questions that resolved YES 52% of the time. It wasn't noisy; it was systematically pessimistic.

Some of that is structural: Noisy-OR measures how much positive support flows into a node, has nowhere to put a prior, and bottoms out at zero when every driver is inhibiting — and 56% of the drivers the model wrote were inhibiting.

But the drivers themselves were the bigger problem. For the Japan question (Japan won; Noisy-OR said 4%), one inhibiting driver cited Germany beating Japan 4–0 "in the 2010 World Cup final". That match never happened — the 2010 final was Spain against the Netherlands. Another copied Japan's 2022 World Cup group into 2026. The model rated that evidence 0.8 out of 1. Across all questions, the average self-assessed evidence score was **0.84**.

Every driver is one more place to confabulate, and the combiner trusts each of them.

## The rescue attempt — and the ablation

A bias this consistent is the one kind of error you *can* fix after the fact, so I tried recalibration (Platt and isotonic), shrinkage and pooling with the market, all fit out of fold. Platt scaling helps a lot: log-odds goes from 0.3897 to 0.2572, Noisy-OR from 0.4121 to 0.2674.

Then the ablation, with every variant recalibrated the same way:

| Variant | Brier |
|---|---|
| base rate only | 0.2567 |
| full causal decomposition | 0.2572 |
| decomposition without evidence scores | 0.2576 |

Asking the model for a base rate and recalibrating it does as well as the whole causal decomposition. The drivers — the part I was proud of — add nothing.

## Caveats

- **Sixty questions is small.** Confidence intervals are wide, and none of my variants separates from the market. The best candidate, pooling the raw LLM into the market at weight 0.25, gains 0.0023 Brier with a bootstrap interval of [-0.0174, +0.0108] — which is to say, nothing.
- **The recalibration numbers deserve suspicion.** They were measured with random 5-fold cross-validation. Later in the project I found that random k-fold leaks on grouped data: a correction that looked real on another benchmark vanished under leave-one-source-out. The *comparison* between variants used identical folds, so I trust the ablation more than the absolute recovery.
- **One model, one prompt family.** The drivers did come with retrieved news — the Japan one cited a dozen articles — but nothing checked their facts against it. A different model, or a step that verifies each driver against the articles it claims to cite, might change the picture. That is the experiment I'd run next.

## What I take from it

**Structure is not information.** A causal decomposition reorganises what the model already believes; it doesn't add anything the model didn't know. When the model's beliefs are already in the base rate, the drivers can only add variance — and here, invented facts.

**A model grading its own evidence is not evidence.** An average evidence score of 0.84 alongside a fabricated World Cup final is the clearest argument I have for checking evidence outside the model.

**Ablate until it hurts.** If removing a component doesn't make the result worse, the component isn't doing anything, however good its output looks. A causal graph is very good at looking like reasoning.

**Always put the dumb baselines in the table.** "Always 50%", "base rate only" and "ask the model directly" cost nothing to run, and they are the only reason I know this result.

The most useful thing CurioCat produced in the end wasn't a forecast. It was the machinery that told me the forecasts didn't work — which I've since turned into a [benchmark auditor](/projects/curiocat/) that looks for the boring explanation before any number gets reported.
