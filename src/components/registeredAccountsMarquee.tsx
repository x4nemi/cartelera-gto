import { useEffect, useState } from "react";
import { Avatar, Link, Spinner } from "@heroui/react";
import { motion } from "motion/react";
import { CosmosAPI, UserData } from "@/config/apiClient";

/**
 * Infinite, auto-scrolling marquee of registered organizers.
 * Pauses on hover. Duplicates the list once so the loop is seamless.
 */
export const RegisteredAccountsMarquee = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        CosmosAPI.getUsers({ status: "approved" })
            .then((data) => {
                if (cancelled) return;
                // Drop users without a profile pic — avatar fallback would look broken in a marquee.
                setUsers(data.filter((u) => u.profilePicUrl));
            })
            .catch(() => {
                if (!cancelled) setUsers([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-6">
                <Spinner size="sm" color="primary" />
            </div>
        );
    }

    if (users.length === 0) return null;

    // Duplicate so the translateX(-50%) animation loops seamlessly.
    const loop = [...users, ...users];
    // Roughly 4 seconds per item — slow enough to read, fast enough to feel alive.
    const duration = Math.max(20, users.length * 4);

    return (
        <section className="w-full flex flex-col gap-3 py-6 md:py-8">
            <div className="flex flex-col items-center text-center gap-1 px-4">
                <h2 className="text-lg md:text-2xl font-semibold tracking-tight">
                    Organizadores en la cartelera
                </h2>
                <p className="text-default-500 text-xs md:text-sm">
                    Estos espacios y colectivos ya publican aquí.
                </p>
            </div>

            {/* Marquee viewport — overflow hidden, edge fade via mask. */}
            <div
                className="relative w-full overflow-hidden group"
                style={{
                    maskImage:
                        "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                    WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                }}
            >
                <motion.div
                    className="flex gap-4 w-max group-hover:[animation-play-state:paused]"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {loop.map((u, i) => (
                        <Link
                            key={`${u.username}-${i}`}
                            href={`https://instagram.com/${u.username}`}
                            isExternal
                            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-content1/70 backdrop-blur-md border border-default text-foreground hover:bg-content2/70 transition-colors shrink-0"
                        >
                            <Avatar
                                src={u.profilePicUrl}
                                name={u.fullName || u.username}
                                size="sm"
                                className="w-7 h-7"
                            />
                            <span className="text-sm font-medium whitespace-nowrap">
                                {u.fullName || `@${u.username}`}
                            </span>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
