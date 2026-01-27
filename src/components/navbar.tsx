import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
	HeartFilledIcon,
} from "@/components/icons";
import { Logo } from "@/components/icons";
import { useState } from "react";
import { Card, Divider } from "@heroui/react";

export const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	return (
		<HeroUINavbar maxWidth="xl" position="sticky" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
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

			   <NavbarMenu style={{height: "64px"}}>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					<Card className="bg-content2 border-2 border-default" shadow="none">
						{siteConfig.navItems.map((item, index) => (
							<div key={`${item}-${index}`}>
							<NavbarMenuItem>
								<Link
									color={
										index === 0
										? "primary"
										: "foreground"
									}
									href={item.href}
									size="lg"
									className="pl-4 py-2"
									>
									{item.label}
								</Link>
							</NavbarMenuItem>
							<Divider className="" />
									</div>
						))}
						<NavbarMenuItem>
							<Link color="foreground" href={siteConfig.links.sponsor} size="lg" isExternal className=" ml-4 mt-3">
								<HeartFilledIcon className="text-danger mr-1" /> Donar
							</Link>
						</NavbarMenuItem>
					</Card>
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	);
};
