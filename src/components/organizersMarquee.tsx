import { Avatar } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfiles";
import type { UserData } from "@/types";

const initials = (u: UserData) => (u.fullName || u.username).slice(0, 2).toUpperCase();

export const OrganizersMarquee = () => {
    const { users, loading } = useProfiles();
    const navigate = useNavigate();

    if (loading || users.length === 0) return null;

    const Chips = ({ ariaHidden }: { ariaHidden?: boolean }) => (
        <div className="flex gap-3 pr-3" aria-hidden={ariaHidden}>
            {users.map((u) => (
                <button
                    key={u.username}
                    type="button"
                    tabIndex={ariaHidden ? -1 : 0}
                    onClick={() => navigate(`/eventos/${u.username}`)}
                    className="marquee-chip flex shrink-0 items-center gap-2 rounded-full border border-default-200 bg-surface px-3 py-2 transition-colors hover:border-default-300"
                >
                    <Avatar className="size-7">
                        <Avatar.Image alt={u.fullName || u.username} src={u.profilePicUrl} />
                        <Avatar.Fallback>{initials(u)}</Avatar.Fallback>
                    </Avatar>
                    <span className="whitespace-nowrap text-sm font-medium">
                        {u.fullName || u.username}
                    </span>
                </button>
            ))}
        </div>
    );

    return (
        <section className="w-full text-center">
            <h2 className="text-h3">Ellos ya están en la cartelera</h2>
            <p className="mt-1 text-sm text-muted">
                {users.length} espacios y colectivos de Guanajuato publican sus eventos aquí
            </p>

            <div className="marquee-mask relative mt-4 overflow-hidden py-3">
                <div className="marquee-track flex w-max hover:[animation-play-state:paused]">
                    <Chips />
                    <Chips ariaHidden />
                </div>
            </div>
        </section>
    );
};
