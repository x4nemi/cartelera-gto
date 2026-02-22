import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
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
		<div className="sticky top-0 z-50 flex justify-center px-[8.33%] mt-3" ref={navMobileRef}>
			<div className="w-full bg-content1 rounded-4xl overflow-hidden">
				<HeroUINavbar maxWidth="xl" position="static" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ menu: "!hidden", base: "!bg-transparent !shadow-none !rounded-none w-full", wrapper: "!px-4" }}>
					<NavbarMenuToggle className="md:hidden" />
					<NavbarContent className="sm:basis-full" justify="start">
						<NavbarBrand className="gap-3 max-w-fit sm:self-center">
							<Link
								className="flex justify-start items-center gap-1"
								color="foreground"
								href="/"
							>
								<Logo />
								<p className="font-bold text-inherit text-lg max-md:text-sm">
									{siteConfig.name}
								</p>
							</Link>
						</NavbarBrand>
						<div className="hidden md:flex gap-4 justify-start ml-2">
							{siteConfig.navItems.map((item) => (
								<NavbarItem key={item.href} isActive={location.pathname === item.href}>
									<Link
										className={clsx(
											linkStyles({ color: "foreground" }),
											"data-[active=true]:text-primary data-[active=true]:font-medium",
										)}
										color="foreground"
										href={item.href}
									>
										{item.label}
									</Link>
								</NavbarItem>
							))}
						</div>
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
				</HeroUINavbar>

				{/* Menu items inside the same rounded container */}
				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							ref={menuBox}
							initial={{ height: 0 }}
							animate={{ height: "auto" }}
							exit={{ height: 0 }}
							transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
							className="overflow-hidden"
						>
							{siteConfig.navItems.map((item, index) => (
								<motion.div
									key={item.href}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
								>
									<Button variant="solid" onPress={handleMenuToggle} href={item.href} as={Link} className="rounded-none py-2 w-full text-start bg-content1 hover:bg-content2" size="lg">
										<Link
											className={clsx(
												linkStyles({ color: "foreground" }),
												"hover:text-primary transition-colors duration-200",
											)}
											color="foreground"
											href={item.href}
											size="lg"
										>
											{item.label}
										</Link>
									</Button>
								</motion.div>
							))}
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
