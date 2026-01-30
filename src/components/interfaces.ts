export interface EventCardProps {
	id: string;
	title: string;
	date: string;
	hour: string;
	image: string;
	username?: string;
	user?: UserProfileProps;
	description?: string;
	isRecurrent?: boolean;
	isCalendarEvent?: boolean;
	type?: "event" | "workshop" | "calendar";
}

export interface UserProfileProps {
	name: string;
	username: string;
	avatarUrl: string;
	location?: string;
	bio?: string;
	socialLinks?: {
		instagram?: string;
		facebook?: string;
		whatsapp?: string;
		website?: string;
	};
}