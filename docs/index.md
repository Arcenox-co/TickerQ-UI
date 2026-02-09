---
layout: home

hero:
  name: "TickerQ"
  text: "Background job scheduler for .NET"
  tagline: "Reflection-free jobs, EF Core persistence, and a real-time dashboard."
  image:
    src: /tickerq-logo.png
    style:
      max-width: 350px
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/quick-start
    - theme: alt
      text: Install
      link: /getting-started/installation
    - theme: alt
      text: View on GitHub
      link: https://github.com/Arcenox-co/TickerQ
features:
  - title: Minimal Core & APIs
    details: Lightweight, reflection-free scheduler with source-generated handlers, manager APIs, and strongly-typed contexts that runs inside your existing .NET app.
  - title: Scheduling & Chaining
    details: Schedule one-off and cron jobs with built-in retries, throttling, priorities, and support for chained parent–child workflows.
  - title: EF Core Persistence
    details: Persist jobs, state, and execution history using TickerQ.EntityFrameworkCore, your own DbContext, and configurable seeding.
  - title: Dashboard & Distributed Operations
    details: Monitor and control jobs via the real-time dashboard UI and coordinate multiple nodes with optional Redis heartbeats and dead-node cleanup.
---

<div style="margin: 2.5rem 0 1.5rem; width: 100%; padding: 2rem 2rem; border: 2px solid transparent; border-radius: 20px; background: linear-gradient(var(--vp-c-bg), var(--vp-c-bg)) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) border-box; box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25), 0 4px 12px var(--vp-c-shadow); display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; justify-content: space-between; position: relative; overflow: hidden;">
<div style="position: absolute; inset: 0; background: radial-gradient(circle at 0% 0%, rgba(102, 126, 234, 0.15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(240, 147, 251, 0.12), transparent 50%); pointer-events: none;"></div>
<div style="position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%); pointer-events: none;"></div>
<div style="display: flex; align-items: center; gap: 1rem; flex: 1 1 280px; position: relative; z-index: 1;">
  <div style="flex-shrink: 0; width: 56px; height: 56px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
  </div>
  <div>
    <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 999px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: white; margin-bottom: 0.5rem; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
      Hub
    </div>
    <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--vp-c-text-1);">TickerQ Hub — Distributed Job Orchestration</h3>
    <p style="margin: 0.4rem 0 0; color: var(--vp-c-text-2); font-size: 0.95rem; line-height: 1.55;">Centralized metadata registry for distributed TickerQ deployments. Coordinate jobs across multiple nodes, track execution status in real-time, and scale your background processing effortlessly.</p>
  </div>
</div>
<a href="https://hub.tickerq.net" target="_blank" style="position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 1.6rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 14px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4); border: none; min-width: 180px; text-align: center; transition: transform 0.2s ease, box-shadow 0.2s ease;">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  Visit hub.tickerq.net
</a>
</div>

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
Email
</a>
</div>
</div>

</div>

</div>
