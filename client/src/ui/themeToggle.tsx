import { Moon, Sun } from "lucide-react"
// import { Button } from "@/components/ui/button"
import { useTheme } from "../context/themeContext"


export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
      console.log("Theme changed to dark")
    } else {
      setTheme("light")
      
    }
  }

  return (
    <>
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
            {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    </>
    
  )
}