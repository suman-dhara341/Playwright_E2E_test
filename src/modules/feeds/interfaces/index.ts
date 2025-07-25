export interface FeedReceivedBy {
	employeeId: string;
	middleName: string;
	lastName: string;
	gender: string;
	primaryEmail: string;
	primaryPhone: string;
}

export interface Feed {
	feedId: any;
	ORG_ID: string;
	timestamp: number;
	feedGivenBy: string;
	feedReceivedBy: FeedReceivedBy;
	likeCount: number;
	commentCount: number;
}

export interface FeedApiResponse {
	data: Feed[];
	nextToken: any;
	message: string;
	status: number;
}

export interface FeedLikeApiResponse {
	message: string;
	status: number;
}
export interface FeedComment {
	feedId: number;
	commentId: string;
	employeeId: string;
	commentContent: string;
	timestamp: number;
}

export interface FeedCommentApiResponse {
	data: FeedComment[];
	message: string;
	nextToken: any;
	status: number;
}

export interface FeedCommentFormValues {
	employeeId: string;
	commentContent: string;
}

export interface Employee {
	employeeId: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: string;
	primaryEmail: string;
	primaryPhone: string;
}

export interface LikeList {
	feedId: string;
	employee: Employee;
	timestamp: number;
	action?: string;
}

export interface LikeListApiResponse {
	data: LikeList[];
	message: string;
	status: number;
}

export interface DrawerProps {
	handleDrawerClose: () => void;
	drawerOpen: boolean;
}
export interface FormValues {
	recognitionGivenBy: string;
	recognitionReceivedBy: string;
	recognitionContent: string;
	bannerFileContent: string;
	bannerFileName: string;
	badgeId: string;
	taggedEmployees: string[];
}

export interface CreateRecognition {
	recognitionGivenBy: string;
	recognitionReceivedBy: string;
	recognitionContent: string;
	bannerFileContent: string;
	bannerFileName: string;
	badgeId: string;
	taggedEmployees: string[];
}
export interface RecognitionApiResponse {
	data: any;
	message: string;
	status: number;
	nextToken: any;
}

export interface FeedDetails {
	commentCount: number;
	feedGivenBy: string;
	feedId: string;
	likeCount: number;
	orgId: string;
}

export interface FeedDetailsApiResponse {
	data: FeedDetails;
	message: string;
	status: number;
}

export interface BadgeDetails {
	type: string;
	category: string;
	name: string;
	description: string;
	badgePhoto: string;
	level: string;
	createdAt: { seconds: number; nanos: number };
}

export interface RecognitionDetails {
	orgId: string;
	recognitionId: string;
	recognitionGivenBy: string;
	recognitionReceivedBy: string;
	recognitionBanner: string;
	recognitionContent: string;
	badgeId: string;
	taggedEmployees: string[];
	likeCount: number;
	commentCount: number;
	timestamp: number;
}

export interface AwardDetails {
	orgId: string;
	awardId: string;
	awardName: string;
	awardPhoto: string;
	description: string;
	criteria: string;
	createdAt: string;
	moderators: string[];
	active: boolean;
}

export interface DetailsProps {
	details: {
		details: {
			badgeDetails?: string;
			recognitionDetails?: string;
			awardDetails?: string;
		}
	};
	type:string
}

export interface CreateRecognition {
	recognitionGivenBy: string;
	recognitionReceivedBy: string;
	recognitionContent: string;
	bannerFileContent: string;
	bannerFileName: string;
	badgeId: string;
	taggedEmployees: string[];
}
export interface RecognitionApiResponse {
	data: any;
	message: string;
	status: number;
	nextToken:any;
}