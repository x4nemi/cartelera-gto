import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
	HeartFilledIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { useEffect, useRef, useState } from "react";
import { Card } from "@heroui/react";

export const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuBox = useRef<HTMLDivElement>(null);
	const navMobileRef = useRef<HTMLDivElement>(null);

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
		<HeroUINavbar maxWidth="xl" position="sticky" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} classNames={{ menu: "backdrop-blur-sm bg-secondary/2" }} ref={navMobileRef}>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarMenuToggle className="md:hidden" />
				<NavbarBrand className="gap-3 max-w-fit">
					<Link
						className="flex justify-start items-center gap-1"
						color="foreground"
						href="/"
					>
						<Logo />
						<p className="font-bold text-inherit text-lg">
							{siteConfig.name}
						</p>
					</Link>
				</NavbarBrand>
				<div className="hidden lg:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
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
				<NavbarItem className="hidden md:flex">
					<Button
						isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Donar
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
				<ThemeSwitch />
			</NavbarContent>

			<NavbarMenu style={{ height: "64px" }}>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					<Card shadow="none" className="rounded-3xl border-2 border-default opacity-95" ref={menuBox}>
						{
							siteConfig.navItems.map((item, index) => (
								<Button variant="solid" key={item.href} onPress={handleMenuToggle} href={item.href} as={Link} className={` ${index === 0 ? "" : " rounded-t-none"} rounded-b-none r w-full text-start dark:bg-content2 bg-content1 border-b-2 border-default`} size="lg">
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
								</Button>
							))
						}
						<Button variant="solid" onPress={handleMenuToggle} className={` rounded-t-none w-full text-start dark:bg-content2 bg-content1`} size="lg" startContent={<HeartFilledIcon className="text-danger animate-pulse -mr-1.5" />}>
							<Link
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium",
								)}
								color="foreground"
								href={siteConfig.links.sponsor}
							>
								Donar
							</Link>
						</Button>
					</Card>
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	);
};
