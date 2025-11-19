"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative h-10 w-10 rounded-full bg-gradient-card border border-border shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 360 : 0,
          scale: theme === "dark" ? 1 : 0.8,
        }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="absolute"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? -360 : 0,
          scale: theme === "light" ? 0.8 : 1,
        }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="absolute"
      >
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}