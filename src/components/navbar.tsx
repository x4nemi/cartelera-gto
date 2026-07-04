import { House, HouseFill, Heart, HeartFill, Sun, Moon } from "@gravity-ui/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const items = [
    { icon: House, iconSelected: HouseFill, label: "Inicio", path: "/" },
    { icon: Heart, iconSelected: HeartFill, label: "Favoritos", path: "/favoritos" },
    
]

/** Read the current theme from the <html> element. */
const getIsDark = () => document.documentElement.classList.contains("dark")

/** Apply a theme: toggle the `dark` class, persist it, and sync the meta theme-color. */
const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
    const meta = document.getElementById("meta-theme-color")
    if (meta) meta.setAttribute("content", dark ? "#18181b" : "#f5f5f4")
}

export const Navbar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [isDark, setIsDark] = useState(getIsDark)

    useEffect(() => {
        const stored = localStorage.getItem("theme")
        if (stored === "light" || stored === "dark") {
            const dark = stored === "dark"
            applyTheme(dark)
            setIsDark(dark)
        }
    }, [])

    const toggleTheme = () => {
        const next = !isDark
        applyTheme(next)
        setIsDark(next)
    }

    return (
        <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
            <ul className="flex items-center gap-4">
                {items.map(({ icon: Icon, iconSelected: IconSelected, label, path }) => {
                    const isActive = pathname === path
                    return (
                        <li key={path}>
                            <button
                                type="button"
                                aria-label={label}
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => navigate(path)}
                                className={[
                                    "flex size-14 items-center justify-center rounded-full",
                                    "backdrop-blur-md shadow-lg transition-all duration-200",
                                    "hover:scale-105 active:scale-95",
                                    // isActive
                                    //     ? "bg-white text-zinc-900"
                                    //     : "bg-white/10 text-white hover:bg-white/20",
                                ].join(" ")}
                            >
                                {isActive ? <IconSelected className="size-6" /> : <Icon className="size-6" />}
                            </button>
                        </li>
                    )
                })}
                <li>
                    <button
                        type="button"
                        aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                        onClick={toggleTheme}
                        className={[
                            "flex size-14 items-center justify-center rounded-full",
                            "backdrop-blur-md shadow-lg transition-all duration-200",
                            "hover:scale-105 active:scale-95",
                        ].join(" ")}
                    >
                        {isDark ? <Sun className="size-6" /> : <Moon className="size-6" />}
                    </button>
                </li>
            </ul>
        </nav>
    )
}
