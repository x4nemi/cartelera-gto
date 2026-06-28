import { House, HouseFill, Heart, HeartFill} from "@gravity-ui/icons"
import { useLocation, useNavigate } from "react-router-dom"

const items = [
    { icon: House, iconSelected: HouseFill, label: "Inicio", path: "/" },
    { icon: Heart, iconSelected: HeartFill, label: "Favoritos", path: "/favoritos" },
    // { icon: Person, iconSelected: PersonFill, label: "Perfil", path: "/perfil" },
]

export const Navbar = () => {
    const navigate = useNavigate()
    const { pathname } = useLocation()

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
            </ul>
        </nav>
    )
}
