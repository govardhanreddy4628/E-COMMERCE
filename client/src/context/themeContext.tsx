import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "marketpulse-ui-theme", ...props }: ThemeProviderProps) {

  const storedTheme = localStorage.getItem(storageKey) as Theme
  const isValidTheme = storedTheme === "light" || storedTheme === "dark" || storedTheme === "system"
  const [theme, setTheme] = useState<Theme>(() => isValidTheme ? storedTheme : defaultTheme)


  useEffect(() => {
    const root = window.document.documentElement    //Grabs the root <html> element of the document.Equivalent to document.querySelector("html").
    root.classList.remove("light", "dark")
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")   //Uses a media query to detect the user’s OS-level theme preference.
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  //   or

//   useEffect(() => {
//   if (theme !== "system") return

//   const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

//   const handleChange = () => {
//     const systemTheme = mediaQuery.matches ? "dark" : "light"
//     const root = document.documentElement
//     root.classList.remove("light", "dark")
//     root.classList.add(systemTheme)
//   }

//   mediaQuery.addEventListener("change", handleChange)

//   return () => mediaQuery.removeEventListener("change", handleChange)
// }, [theme])


  const setThemeAndStore = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setTheme(newTheme)
  }
  const value = useMemo(
    () => ({ theme, setTheme: setThemeAndStore }),
    [theme]
  )


  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}