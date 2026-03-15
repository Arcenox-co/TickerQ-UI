<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { computed, nextTick, provide } from 'vue'

const { isDark } = useData()
const route = useRoute()

const section = computed(() => {
  const path = route.path
  if (path === '/' || path === '/index.html') {
    return null
  }
  if (path.startsWith('/features/hub')) {
    return { title: 'TickerQ Hub', class: 'hub' }
  }
  if (path.startsWith('/api-reference/') && !path.startsWith('/api-reference/configuration/')) {
    return { title: 'API Reference', class: 'api-ref' }
  }
  if (path.startsWith('/releases')) {
    return { title: 'Releases', class: 'releases' }
  }
  if (path.startsWith('/examples')) {
    return { title: 'Examples', class: 'examples' }
  }
  return { title: 'Guide', class: 'guide' }
})

const enableTransitions = () =>
  'startViewTransition' in document &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-after>
      <span v-if="section" class="section-badge" :class="section.class">
        [ {{ section.title }} ]
      </span>
    </template>
  </DefaultTheme.Layout>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}

.section-badge {
  display: inline-block;
  margin-left: 8px;
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  vertical-align: middle;
  position: relative;
  top: -1px;
  background: none;
  border: none;
}

.section-badge.guide { color: #f3d5a3; }
.section-badge.api-ref { color: #60a5fa; }
.section-badge.hub { color: #a78bfa; }
.section-badge.releases { color: #34d399; }
.section-badge.examples { color: #fb923c; }

:root:not(.dark) .section-badge.guide { color: #92600a; }
:root:not(.dark) .section-badge.api-ref { color: #1d4ed8; }
:root:not(.dark) .section-badge.hub { color: #6d28d9; }
:root:not(.dark) .section-badge.releases { color: #047857; }
:root:not(.dark) .section-badge.examples { color: #c2410c; }
</style>
