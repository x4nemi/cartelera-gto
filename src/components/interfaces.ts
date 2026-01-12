export interface EventCardProps {
	title: string;
	date: string;
	hour: string;
	image: string;
	username?: string;
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