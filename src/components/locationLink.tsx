import { Link } from '@heroui/link'

export const locationLink = () => {
    return (
        <div className="flex gap-3 items-center">
            <div className="flex items-center justify-center border-1 border-default-200/50 rounded-small w-11 h-11">
                <svg
                    className="text-default-500"
                    height="20"
                    viewBox="0 0 16 16"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g
                        fill="none"
                        fillRule="evenodd"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    >
                        <path d="M2 6.854C2 11.02 7.04 15 8 15s6-3.98 6-8.146C14 3.621 11.314 1 8 1S2 3.62 2 6.854" />
                        <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                    </g>
                </svg>
            </div>
            <div className="flex flex-col gap-0.5">
                <Link
                    isExternal
                    showAnchorIcon
                    anchorIcon={
                        <svg
                            className="group-hover:text-inherit text-default-400 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            fill="none"
                            height="16"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                    }
                    className="group gap-x-0.5 text-medium text-foreground font-medium"
                    href="https://www.google.com/maps/place/555+California+St,+San+Francisco,+CA+94103"
                    rel="noreferrer noopener"
                >
                    555 California St suite 500
                </Link>
                <p className="text-small text-default-500">San Francisco, California</p>
            </div>
        </div>
    )
}
