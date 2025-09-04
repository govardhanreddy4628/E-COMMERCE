import { Sun } from "lucide-react"
import { useTheme } from "../context/themeContext"
import { IconButton } from "@mui/material"
import { LuSunMoon } from "react-icons/lu";


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
        <IconButton
            onClick={toggleTheme}
            className="rounded-full"
        >
            {theme === "light" ? (
            <LuSunMoon className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground" />
            ) : (
            <Sun className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
            )}
        </IconButton>
    </>
    
  )
}