import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from '@/providers/theme-context'

interface ThemeProviderProps {
  children: ReactNode
}

const storageKey = 'wispzyron-theme'

function getStoredTheme(): Theme {
  try {
    const storedTheme = localStorage.getItem(storageKey)

    if (
      storedTheme === 'light' ||
      storedTheme === 'dark' ||
      storedTheme === 'system'
    ) {
      return storedTheme
    }
  } catch {
    // Si el navegador bloquea localStorage, usamos Sistema.
  }

  return 'system'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.dataset.theme = theme
    }

    try {
      localStorage.setItem(storageKey, theme)
    } catch {
      // La aplicación sigue funcionando aunque no se pueda persistir la opción.
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
