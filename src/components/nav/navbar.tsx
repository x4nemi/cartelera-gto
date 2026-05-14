import { Link } from "@heroui/link";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle
} from "@heroui/navbar";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/nav/theme-switch";
import { Logo } from "@/components/icons";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuBox = useRef<HTMLDivElement>(null);
	const navMobileRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	const handleMenuToggle = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const handleClickOutside = (event: MouseEvent) => {
        if (menuBox.current && !menuBox.current.contains(event.target as Node) && navMobileRef.current?.firstChild && !navMobileRef.current?.firstChild.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);
	return (
		<>
		<div className="fixed bottom-0 inset-x-0 md:fixed md:top-0 md:bottom-auto z-50 flex justify-center pt-1 pb-3 md:pt-3 md:pb-1" ref={navMobileRef}>
			<div className="w-10/12 bg-content1/70 backdrop-blur-sm rounded-4xl overflow-hidden flex flex-col-reverse md:flex-col border border-default">
				<HeroUINavbar maxWidth="full" position="static" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ menu: "!hidden", base: "bg-transparent !rounded-none w-full", wrapper: "!px-4" }}>
					<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
						<NavbarBrand className="gap-3 max-w-fit">
							<Link
								className="flex justify-start items-center"
								color="foreground"
								href="/"
								aria-label={siteConfig.name}
							>
								<Logo />
							</Link>
						</NavbarBrand>
					</NavbarContent>

					<NavbarContent className="hidden md:flex gap-6" justify="center">
						{siteConfig.navItems.map((item) => (
							<NavbarItem key={item.href} isActive={location.pathname === item.href}>
								<Link
									color="foreground"
									href={item.href}
								>
									{item.label}
								</Link>
							</NavbarItem>
						))}
					</NavbarContent>

					<NavbarContent
						className="hidden sm:flex basis-1/5 sm:basis-full"
						justify="end"
					>
						<NavbarItem className="hidden sm:flex gap-2">
							<ThemeSwitch />
						</NavbarItem>
					</NavbarContent>

					<NavbarContent className="sm:hidden basis-1" justify="end">
						<ThemeSwitch />
					</NavbarContent>
					<NavbarMenuToggle className="md:hidden" />
				</HeroUINavbar>

				{/* Menu items inside the same rounded container */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							initial={{ height: 0 }}
							animate={{ height: "auto" }}
							exit={{ height: 0 }}
							transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
							className="overflow-hidden"
						>
						<div ref={menuBox} className="flex flex-col p-2 gap-1">
							{siteConfig.navItems.map((item, index) => {
								const isActive = location.pathname === item.href;
								const isLast = index === siteConfig.navItems.length - 1;
								return (
									<motion.div
										key={item.href}
										initial={{ opacity: 0, x: -8 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.05 + index * 0.04, duration: 0.2 }}
									>
										<Link
											href={item.href}
											color="foreground"
											className={`w-full flex items-center px-5 py-4 rounded-3xl transition-colors duration-200 ${
												isActive
													? "bg-primary/10 text-primary font-semibold"
													: "hover:bg-content2"
											}`}
											size="lg"
											onPress={handleMenuToggle}
										>
											<span>{item.label}</span>
										</Link>
										{!isLast && (
											<div className="h-px bg-default/40 mx-5" />
										)}
									</motion.div>
								);
							})}
						</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>

		{/* Blurred backdrop overlay */}
		<AnimatePresence>
			{isMenuOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
					onClick={() => setIsMenuOpen(false)}
				/>
			)}
		</AnimatePresence>
		</>
	);
};
