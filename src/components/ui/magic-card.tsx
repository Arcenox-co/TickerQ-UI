"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

interface MagicCardBaseProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientFrom?: string
  gradientTo?: string
  /** Frosted glass (blur + translucency) always on; default is hover-only. */
  glassAlwaysVisible?: boolean
  /** Extra classes for the frosted layer (e.g. lighter `bg-*` for contrast). */
  glassOverlayClassName?: string
}

interface MagicCardGradientProps extends MagicCardBaseProps {
  mode?: "gradient"

  gradientColor?: string
  gradientOpacity?: number
  /** Keep the inner spotlight gradient visible (as if the card were hovered). */
  gradientAlwaysVisible?: boolean

  glowFrom?: never
  glowTo?: never
  glowAngle?: never
  glowSize?: never
  glowBlur?: never
  glowOpacity?: never
}

interface MagicCardOrbProps extends MagicCardBaseProps {
  mode: "orb"

  glowFrom?: string
  glowTo?: string
  glowAngle?: number
  glowSize?: number
  glowBlur?: number
  glowOpacity?: number

  gradientColor?: never
  gradientOpacity?: never
}

type MagicCardProps = MagicCardGradientProps | MagicCardOrbProps
type ResetReason = "enter" | "leave" | "global" | "init"

function isOrbMode(props: MagicCardProps): props is MagicCardOrbProps {
  return props.mode === "orb"
}

export function MagicCard(props: MagicCardProps) {
  const {
    children,
    className,
    gradientSize = 200,
    gradientColor = "hsl(217 92% 97%)",
    gradientOpacity = 0.8,
    gradientFrom = "#9E7AFF",
    gradientTo = "#FE8BBB",
    mode = "gradient",
  } = props

  const gradientAlwaysVisible =
    !isOrbMode(props) && (props.gradientAlwaysVisible ?? false)

  const glassAlwaysVisible = props.glassAlwaysVisible ?? false
  const glassOverlayClassName = props.glassOverlayClassName

  const glowFrom = isOrbMode(props) ? (props.glowFrom ?? "#ee4f27") : "#ee4f27"
  const glowTo = isOrbMode(props) ? (props.glowTo ?? "#6b21ef") : "#6b21ef"
  const glowAngle = isOrbMode(props) ? (props.glowAngle ?? 90) : 90
  const glowSize = isOrbMode(props) ? (props.glowSize ?? 420) : 420
  const glowBlur = isOrbMode(props) ? (props.glowBlur ?? 60) : 60
  const glowOpacity = isOrbMode(props) ? (props.glowOpacity ?? 0.9) : 0.9
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDarkTheme = useMemo(() => {
    if (!mounted) return true
    const currentTheme = theme === "system" ? systemTheme : theme
    return currentTheme === "dark"
  }, [theme, systemTheme, mounted])

  /** Soft light stops instead of fading to transparent — reads as glass / frosted base */
  const spotlightMid = useMemo(
    () =>
      isDarkTheme ? "hsla(220, 25%, 96%, 0.14)" : "hsla(220, 45%, 99%, 0.55)",
    [isDarkTheme],
  )
  const spotlightEnd = useMemo(
    () =>
      isDarkTheme ? "hsla(220, 20%, 94%, 0.06)" : "hsla(220, 40%, 99%, 0.82)",
    [isDarkTheme],
  )

  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const orbX = useSpring(mouseX, { stiffness: 250, damping: 30, mass: 0.6 })
  const orbY = useSpring(mouseY, { stiffness: 250, damping: 30, mass: 0.6 })
  const orbVisible = useSpring(0, { stiffness: 300, damping: 35 })

  const modeRef = useRef(mode)
  const glowOpacityRef = useRef(glowOpacity)
  const gradientSizeRef = useRef(gradientSize)

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    glowOpacityRef.current = glowOpacity
  }, [glowOpacity])

  useEffect(() => {
    gradientSizeRef.current = gradientSize
  }, [gradientSize])

  const reset = useCallback(
    (reason: ResetReason = "leave") => {
      const currentMode = modeRef.current

      if (currentMode === "orb") {
        if (reason === "enter") orbVisible.set(glowOpacityRef.current)
        else orbVisible.set(0)
        return
      }

      const off = -gradientSizeRef.current
      mouseX.set(off)
      mouseY.set(off)
    },
    [mouseX, mouseY, orbVisible]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset("init")
  }, [reset])

  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gradientAlwaysVisible || mode !== "gradient") return
    const el = cardRef.current
    if (!el) return
    const setCenter = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      mouseX.set(w / 2)
      mouseY.set(h / 2)
    }
    setCenter()
    const ro = new ResizeObserver(setCenter)
    ro.observe(el)
    return () => ro.disconnect()
  }, [gradientAlwaysVisible, mode, mouseX, mouseY])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset("global")
    }
    const handleBlur = () => reset("global")
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset("global")
    }

    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", handleBlur)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", handleBlur)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => reset("leave")}
      onPointerEnter={() => reset("enter")}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--color-background) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--color-border) 100%
          ) border-box
        `,
      }}
    >
      <div
        className={cn(
          "absolute inset-px z-20 rounded-[inherit] transition-[background-color,backdrop-filter,box-shadow] duration-300 ease-out",
          glassAlwaysVisible
            ? [
                "bg-background/48 dark:bg-background/40",
                "backdrop-blur-xl backdrop-saturate-150",
                "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
                "group-hover:bg-background/42 dark:group-hover:bg-background/34",
              ]
            : [
                "bg-background/92 backdrop-blur-none",
                "group-hover:bg-background/48 dark:group-hover:bg-background/40",
                "group-hover:backdrop-blur-xl group-hover:backdrop-saturate-150",
                "shadow-none group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)]",
                "dark:group-hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]",
              ],
          glassOverlayClassName,
        )}
      />

      {mode === "gradient" && (
        <motion.div
          suppressHydrationWarning
          className={cn(
            "pointer-events-none absolute inset-px z-30 rounded-[inherit] transition-opacity duration-300",
            gradientAlwaysVisible
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
          )}
          style={{
            background: useMotionTemplate`
              radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
                ${gradientColor} 0%,
                ${spotlightMid} 42%,
                ${spotlightEnd} 100%
              )
            `,
            opacity: gradientOpacity,
          }}
        />
      )}

      {mode === "orb" && (
        <motion.div
          suppressHydrationWarning
          aria-hidden="true"
          className="pointer-events-none absolute z-30"
          style={{
            width: glowSize,
            height: glowSize,
            x: orbX,
            y: orbY,
            translateX: "-50%",
            translateY: "-50%",
            borderRadius: 9999,
            filter: `blur(${glowBlur}px)`,
            opacity: orbVisible,
            background: `linear-gradient(${glowAngle}deg, ${glowFrom}, ${glowTo})`,

            mixBlendMode: isDarkTheme ? "screen" : "multiply",
            willChange: "transform, opacity",
          }}
        />
      )}
      <div className="relative z-40">{children}</div>
    </motion.div>
  )
}
