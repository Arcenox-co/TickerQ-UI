---
layout: home

hero:
  name: "TickerQ"
  text: ""
  tagline: "TickerQ is a fast, reflection-free background task scheduler for .NET — built with source generators, EF Core integration, cron + time-based execution, and a real-time dashboard."
  image:
    src: /tickerq-logo.png
    style:
      max-width: 350px
  actions:
    - theme: brand
      text: Get Started
      link: /intro/what-is-tickerq
    - theme: alt
      text: View on GitHub
      link: https://github.com/Arcenox-co/TickerQ

features:
  - title: Minimal Core, Maximum Performance
    details: The core `TickerQ` library is lightweight, reflection-free, and dependency-free—designed to run inside your .NET application with ultra-low overhead and deterministic execution.
  - title: EF Core Integration with TickerQ.EntityFramework
    details: Add `TickerQ.EntityFramework` to persist tickers, job states, and execution history in your own database. Built to plug directly into your existing `DbContext` with full support for queries, retries, and cleanup.
  - title: Visual Control with TickerQ.Dashboard
    details: Bring visibility to your background processing. The `TickerQ.Dashboard` package provides a ready-to-use, real-time web UI to inspect, manage, and trigger jobs—powered by SignalR and styled with Tailwind.
  - title: Advanced Scheduling Engine
    details: Whether it's second-precise `TimeTickers` or flexible `CronTickers`, TickerQ supports both with built-in throttling, cooldown control, and priority-based job queuing.
---

<div class="vp-doc">

## Our Sponsor

*Thank you to our amazing sponsor supporting TickerQ development*

<div style="display: flex; justify-content: center; margin: 3rem 0; padding: 0 1rem;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 16px; padding: 2rem; text-align: center; background: var(--vp-c-bg-soft); box-shadow: 0 6px 24px var(--vp-c-shadow); transition: all 0.3s ease; position: relative; overflow: hidden; max-width: 350px; width: 100%; backdrop-filter: blur(10px);">
<div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #ffd700, #ffed4e, #ff6b6b);"></div>
<img src="https://urasolutions.com/lovable-uploads/9e97311a-a23c-49f9-880f-dad5cb9259e0.png" alt="Urasolutions" style="width: 70px; height: 70px; object-fit: contain; margin: 0 auto 1.2rem; display: block; border-radius: 8px;">
<h3 style="margin: 0.5rem 0 0.8rem; color: var(--vp-c-text-1); font-size: 1.2rem; font-weight: 600;">Urasolutions</h3>
<p style="color: var(--vp-c-text-2); margin: 0 0 1.5rem; font-size: 0.9rem; line-height: 1.5;">Innovative technology solutions and digital transformation services</p>
<a href="https://urasolutions.com" target="_blank" style="display: inline-block; padding: 0.6rem 1.5rem; background: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-brand-dark) 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 0.9rem; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 3px 12px var(--vp-c-brand-light);">Visit Website</a>
</div>

</div>

## Support TickerQ Development

<div style="background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 16px; padding: 2rem; margin: 3rem 0; text-align: center; position: relative; overflow: hidden; box-shadow: 0 6px 24px var(--vp-c-shadow); backdrop-filter: blur(10px); max-width: 600px; margin-left: auto; margin-right: auto;">
<div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #4facfe 100%);"></div>

<div style="display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">

<div style="display: flex; align-items: center; gap: 1rem;">
<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.4rem; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);">AK</div>
<div style="text-align: left;">
<h3 style="margin: 0 0 0.3rem; color: var(--vp-c-text-1); font-size: 1.3rem; font-weight: 600;">Maintained by Albert Kunushevci</h3>
<p style="color: var(--vp-c-text-2); margin: 0; font-size: 0.9rem; line-height: 1.4;">Open-source .NET background task scheduler</p>
</div>
</div>

<p style="color: var(--vp-c-text-2); margin: 0 0 1.5rem; font-size: 0.9rem; line-height: 1.5; text-align: center; max-width: 500px;">Your support helps ensure continuous development, new features, and long-term sustainability of TickerQ.</p>

<div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
<a href="https://opencollective.com/tickerq" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 0.8rem; padding: 1.2rem 2rem; background: var(--vp-c-bg); border: 2px solid var(--vp-c-divider); color: var(--vp-c-text-1); text-decoration: none; border-radius: 12px; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 3px 12px var(--vp-c-shadow); max-width: 300px;">
<img src="https://next-images.opencollective.com/_next/image?url=%2Fstatic%2Fimages%2Foc-logo-watercolor-256.png&w=64&q=75" alt="Open Collective" style="width: 20px; height: 20px; object-fit: contain;">
<div style="text-align: left;">
<div style="font-size: 1rem; font-weight: 600;">Open Collective</div>
<div style="font-size: 0.8rem; color: var(--vp-c-text-2);">Transparent Funding</div>
</div>
</a>
</div>

<div style="border-top: 1px solid var(--vp-c-divider); padding-top: 1.5rem; width: 100%;">
<div style="display: flex; gap: 0.8rem; justify-content: center; flex-wrap: wrap;">
<a href="https://github.com/arcenox" target="_blank" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 500; transition: all 0.3s ease;">
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> GitHub
</a>
<a href="https://linkedin.com/in/albertkunushevci" target="_blank" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 500; transition: all 0.3s ease;">
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn
</a>
<a href="mailto:albert@arcenox.com" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 500; transition: all 0.3s ease;">
<span style="font-size: 1rem;">📧</span> Email
</a>
</div>
</div>

</div>

</div>

</div>
---
