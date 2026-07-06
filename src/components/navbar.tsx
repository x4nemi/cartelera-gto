import { House, HouseFill, Heart, HeartFill, Sun, Moon, Magnifier, SquareListUl, ArrowsRotateLeft } from "@gravity-ui/icons"
import { Button } from "@heroui/react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"

/** Read the current theme from the <html> element. */
const getIsDark = () => document.documentElement.classList.contains("dark")

/** Apply a theme: toggle the `dark` class, persist it, and sync the meta theme-color. */
const applyTheme = (dark: boolean) => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
    const meta = document.getElementById("meta-theme-color")
    if (meta) meta.setAttribute("content", dark ? "#18181b" : "#f5f5f4")
}

const PUBLISH_URL = "https://www.instagram.com/cartelera.gto"

type IconType = (props: { className?: string }) => React.JSX.Element

const tabs: { icon: IconType; iconActive: IconType; label: string; path: string }[] = [
    { icon: House, iconActive: HouseFill, label: "Inicio", path: "/" },
    { icon: SquareListUl, iconActive: SquareListUl, label: "Agenda", path: "/agenda" },
    { icon: ArrowsRotateLeft, iconActive: ArrowsRotateLeft, label: "Semanales", path: "/recurrentes" },
    { icon: Heart, iconActive: HeartFill, label: "Guardados", path: "/favoritos" },
]

export const Navbar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [searchParams] = useSearchParams()
    const [isDark, setIsDark] = useState(getIsDark)
    const [query, setQuery] = useState(searchParams.get("q") ?? "")

    // Keep the input in sync with the URL so the term persists across navigation.
    useEffect(() => {
        setQuery(searchParams.get("q") ?? "")
    }, [searchParams])

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

    const isActive = (path: string) => pathname === path

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const q = query.trim()
        navigate(q ? `/buscar?q=${encodeURIComponent(q)}` : "/buscar")
    }

    const openPublish = () =>
        window.open(PUBLISH_URL, "_blank", "noopener,noreferrer")

    return (
        <>
            {/* Desktop · sticky top bar */}
            <header className="fixed inset-x-0 top-0 z-50 hidden px-4 pt-3 md:block">
                <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-default-200 bg-default-50/90 px-5 py-2.5 shadow-lg backdrop-blur">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-lg font-bold"
                    >
                        Cartelera <span style={{ color: "var(--accent)" }}>GTO</span>
                    </button>

                    <nav className="flex items-center gap-1">
                        <NavPill label="Agenda" active={isActive("/agenda")} onClick={() => navigate("/agenda")} />
                        <NavPill label="Recurrentes" active={isActive("/recurrentes")} onClick={() => navigate("/recurrentes")} />
                    </nav>

                    <form onSubmit={submitSearch} className="relative ml-auto w-56 lg:w-72">
                        <Magnifier className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar"
                            aria-label="Buscar eventos"
                            className="w-full rounded-full border border-default-200 bg-default-100/50 py-2 pl-11 pr-4 text-sm outline-none transition-colors focus:border-default-300"
                        />
                    </form>

                    <button
                        type="button"
                        aria-label="Guardados"
                        aria-current={isActive("/favoritos") ? "page" : undefined}
                        onClick={() => navigate("/favoritos")}
                        className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-default-100"
                        style={isActive("/favoritos") ? { color: "var(--accent)" } : undefined}
                    >
                        {isActive("/favoritos") ? <HeartFill className="size-5" /> : <Heart className="size-5" />}
                    </button>

                    <button
                        type="button"
                        aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                        onClick={toggleTheme}
                        className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-default-100"
                    >
                        {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
                    </button>

                    <Button className="shrink-0" onPress={openPublish}>
                        Publicar
                    </Button>
                </div>
            </header>

            {/* Móvil · tab bar inferior fija */}
            <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
                <ul className="flex items-center gap-1 rounded-3xl border border-default-200 bg-default-50/95 px-2 py-2 shadow-lg backdrop-blur">
                    {tabs.map(({ icon: Icon, iconActive: IconActive, label, path }) => {
                        const active = isActive(path)
                        return (
                            <li key={path}>
                                <button
                                    type="button"
                                    aria-label={label}
                                    aria-current={active ? "page" : undefined}
                                    onClick={() => navigate(path)}
                                    className="flex w-16 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 transition-colors"
                                    style={active ? { color: "var(--accent)" } : undefined}
                                >
                                    {active ? <IconActive className="size-6" /> : <Icon className="size-6" />}
                                    <span className="text-[11px] font-medium leading-none">{label}</span>
                                </button>
                            </li>
                        )
                    })}
                    <li>
                        <button
                            type="button"
                            aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
                            onClick={toggleTheme}
                            className="flex w-16 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-muted transition-colors"
                        >
                            {isDark ? <Sun className="size-6" /> : <Moon className="size-6" />}
                            <span className="text-[11px] font-medium leading-none">Tema</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

const NavPill = ({
    label,
    active,
    onClick,
}: {
    label: string
    active: boolean
    onClick: () => void
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-default-100"
        style={
            active
                ? {
                      backgroundColor: "color-mix(in oklch, var(--accent) 15%, transparent)",
                      color: "var(--accent)",
                  }
                : undefined
        }
    >
        {label}
    </button>
)
