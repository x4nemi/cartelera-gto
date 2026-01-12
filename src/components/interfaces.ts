export interface EventCardProps {
	title: string;
	date: string;
	hour: string;
	location: string;
	description: string;
	image: string;
	username?: string;
}

export interface UserProfileProps {
	name: string;
	username: string;
	avatarUrl: string;
	bio: string;
	followers: number;
	following: number;
	eventsCreated: number;
}