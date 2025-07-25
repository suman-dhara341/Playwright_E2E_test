export interface EmployeeAttributes {
	race: string;
	residence: string;
}
export interface ForgotPasswordFormValues {
	email: string;
}

export interface RecognitionEmployee {
	employeeId: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender?: string;
	primaryEmail: string;
	primaryPhone?: string;
	photo?: string;
}
export interface TaggedEmployee {
	employeeId: string;
	firstName: string;
	lastName: string;
	primaryEmail: string;
}
export interface Recognition {
	orgId: string;
	recognitionId: string;
	recognitionGivenBy: RecognitionEmployee;
	recognitionReceivedBy: RecognitionEmployee;
	recognitionBanner: string;
	recognitionContent: string;
	taggedEmployees: TaggedEmployee[];
	likeCount: number;
	commentCount: number;
	timestamp: number;
}
export interface RecognitionApiResponse {
	data: Recognition[];
	message: string;
	status: number;
	nextToken: any;
}
export interface Department {
	departmentCode: string;
	departmentName: string;
	departmentHead: string;
	description: string;
	entityId: string;
	version: number;
	createdAt: number;
}

export interface Designation {
	designationCode: string;
	designationName: string;
	jobDescription: string;
	employeeTitle: string;
	entityId: string;
	version: number;
	createdAt: number;
}
export interface Grade {
	gradeCode: string;
	gradeDescription: string;
	entityId: string;
	version: number;
	createdAt: number;
}
export interface EmployeeProfile {
	orgId: string;
	employeeId: string;
	firstName: string;
	middleName: string;
	lastName: string;
	shortDescription: string;
	dateOfBirth: string;
	gender: string;
	nationality: string;
	joiningDate: string;
	primaryEmail: string;
	primaryPhone: string;
	department: Department;
	reportsTo: string;
	designation: Designation;
	grade: Grade;
	roleId: string;
	active: boolean;
	onboardingStatus: boolean;
	photo: string;
	directReportee: number;
	totalAward: number;
	totalBadge: number;
	totalRecognition: number;
	totalFeed: number;
}
export interface EmployeeProfileApiResponse {
	data: EmployeeProfile;
	message: string;
	status: number;
}
export interface EmployeeJourney {
	effectedColumn: any;
	employeeId: string;
	order: number;
	reportsTo: string | null;
	reportsToName: string;
	startDate: string;
	endDate: string;
	department: string;
	designation: string;
	grade: string;
	location: string;
	businessTitle: string;
}
export interface EmployeeJourneyApiResponse {
	data: EmployeeJourney[];
	message: string;
	status: number;
}
export interface ProfileRecognition {
	ORG_ID: string;
	recognitionId: string;
	recognitionGivenBy: string;
	recognitionReceivedBy: string;
	recognitionBanner: string;
	recognitionContent: string;
	likeCount: number;
	commentCount: number;
	timestamp: number;
}
export interface EmployeeAward {
	awardPhoto: any;
	data: EmployeeAward[];
	title: string;
	ORG_ID: string;
	awardId: string;
	awardName: string;
	description: string;
	criteria: string;
	createdAt: string;
	moderators: string[];
	active: boolean;
}
export interface employeeImageUploadData {
	avatarFileName: string;
	avatarFileType: string;
	avatarFileBase64: string;
}
export interface FeedbackData {
	areaName: string;
	questionDetails: any;
	status: string;
	employeeId: string;
	feedbackDate: string;
	orgId: string;
	managerId: string;
	areaId: string;
	questionId: string;
	managerTotalTeam: number;
	managerTotalMember: number;
	managerTotalMemberQNotReceived: number;
	managerTotalMemberQReceived: number;
	managerTotalMemberQSeen: number;
	managerTotalMemberQResponded: number;
	managerTotalMemberQSkipped: number;
	directFeedBackPoint: number;
	directFeedBackQuestionCount: number;
	directFeedBackPercentage: number;
	optionWiseTeam: number[];
	managerTeamPercentage: number;
	grandPercentage: number;
	createdAt: number;
}
export interface FeedbackApiResponse {
	data: FeedbackData[];
	message: string;
	status: number;
}
export interface CalenderResponse {
	orgId: string;
	feedbackId: string;
	answer: string;
	areaId: string;
	createdAt: number;
	employeeId: string;
	feedbackDate: string;
	managerId: string;
	orgId_employeeId_questionType: string;
	point: number;
	questionId: string;
	relateTo: string;
	status: string;
}
export interface CalenderApiResponse {
	data: CalenderResponse[];
	message: string;
	status: number;
}

export interface OrgHierarchyReportingManager {
	orgId: string;
	employeeId: string;
	employeeName: string;
	designation?: string;
	level?: string;
	role?: string;
	tenure?: string;
	businessTitle?: string;
	email: string;
}

export interface EmployeeHierarchy {
  	nodeType?: string;
	children: EmployeeHierarchy[];
	directReportee?: number;
	employeeId: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: string;
	joiningDate: string;
	primaryEmail: string;
	primaryPhone: string;
	department: string;
	designation: string;
	grade: string;
	photo: string;
	reportsTo?: string | null;
	active: boolean;
}

export interface OrgHierarchyEmployeeResponse {
	data: EmployeeHierarchy[];
	message: string;
	status: number;
}
export interface Contact {
	referenceEntityId: string;
	contactId: string;
	orgId: string;
	use: string;
	type: string;
	value: string;
}
export interface ContactListResponse {
	data: Contact[];
	message: string;
	status: number;
}
export interface UpdateEmployeeDetails {
	firstName: string;
	lastName: string;
	middleName?: string;
	gender: string;
	primaryEmail: string;
	primaryPhone: string;
	reportsTo: string;
	dateOfBirth: string;
	nationality: string;
	joiningDate: string;
	grade: string;
	costCenter: string;
	department: string;
	designation: string;
	location: string;
	shortDescription: string
}
export interface EmployeeContact {
	use: string;
	type: string;
	value: string;
}
export interface Address {
	referenceEntityId: string;
	addressId: string;
	orgId: string;
	use: string;
	type: string;
	text: string;
	addressLine: string[];
	city: string;
	district: string;
	state: string;
	postalCode: string;
	country: string;
}
export interface EmployeeAddressListApiResponse {
	data: Address[];
	message: string;
	status: number;
}
export interface EmployeeAddressData {
	addressId?: string;
	use: string;
	type: string;
	text: string;
	addressLine: string[];
	city: string;
	district: string;
	state: string;
	postalCode: string;
	country: string;
}
export interface MonthlyData {
	[month: string]: {
		grandPercentage: number;
		managerTotalMember: number;
		noOfQuestions: number;
	};
}
export interface AreaData {
	areaName: string;
	areaId: string;
	monthlyData: MonthlyData;
}
export interface AllAreaWiseReport {
	data: AreaData[];
	message: string;
	status: number;
}
export interface verifyFormValues {
	email: string;
	code: string;
}

// Insight interface
export interface TotalAwardInsight {
	month: string;
	total_awards: number;
}
export interface TotalAwardInsightResponse {
	data: TotalAwardInsight[];
	message: string;
	status: number;
}
export interface TotalBadgeInsight {
	month: string;
	total_badges: number;
}
export interface TotalBadgeInsightResponse {
	data: TotalBadgeInsight[];
	message: string;
	status: number;
}
export interface TotalRecognitionInsight {
	month: string;
	total_recognitions: number;
}
export interface TotalRecognitionInsightResponse {
	data: TotalRecognitionInsight[];
	message: string;
	status: number;
}
export interface TotalFeedInsight {
	month: string;
	total_feeds: number;
}
export interface TotalFeedInsightResponse {
	data: TotalFeedInsight[];
	message: string;
	status: number;
}
export interface TotalFeedLikeInsight {
	month: string;
	total_likes: number;
}
export interface TotalFeedLikeInsightResponse {
	data: TotalFeedLikeInsight[];
	message: string;
	status: number;
}
export interface TotalFeedCommentInsight {
	month: string;
	total_comments: number;
}
export interface TotalFeedCommentInsightResponse {
	data: TotalFeedCommentInsight[];
	message: string;
	status: number;
}


export interface EmployeeDetail {
	employeeId: string;
	firstName: string;
	middleName: string;
	lastName: string;
	gender: string;
	primaryEmail: string;
	primaryPhone: string;
	department: string;
	designation: string;
	grade: string;
	location: string;
	active: boolean;
	photo?: string;
	reportsTo: string | null;
}

export interface Activity {
	notificationId: string;
	orgId: string;
	fromEmployeeDetail: EmployeeDetail;
	toEmployeeDetail: EmployeeDetail;
	taggedEmployee: any[];
	notificationChannel: string;
	notificationType: string;
	notificationSlug: string;
	notificationFor: string;
	serviceRecordId: string;
	messageTitle: string;
	messageBody: string;
	deliveredAt: string;
	variables: {
		comment: string;
		[key: string]: any;
	};
	status: string;
	createdAt: number;
}

export interface ActivityResponse {
	data: Activity[];
	nextToken: string;
	message: string;
	status: number;
}
