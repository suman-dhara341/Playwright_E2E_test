export interface Badge {
  awardedAt: any;
	filter(arg0: (badge: Badge) => boolean): unknown;
	type: string;
	category: string;
	name: string;
	description: string;
	badgePhoto: string;
	level: string;
	createdAt: Timestamp;
  totalReceiver: number
}

export interface Timestamp {
	seconds: number;
	nanos: number;
}

export interface BadgeApiResponse {
	data: any;
	message: string;
	status: number;
	nextToken: any;
}

export interface BadgeCardProps {
	badges: Badge[];
	isLoading: boolean;
}

export interface BadgeDetails {
  type: string;
  category: string;
  name: string;
  description: string;
  badgePhoto: string;
  level: string;
  createdAt: number;
  totalReceiver: number
}

export interface BadgeDescriptionApiResponse {
  data: BadgeDetails;
  message: string;
  status: number;
}

export interface PopularBadge {
	org_id: string;
	badge_type: string;
	badge_category: string;
}

export interface PopularBadgesApiResponse {
	data: PopularBadge[];
	message: string;
	status: number;
}
export interface BadgeWinnersTotalCount {
	total_winners: string;
}

export interface BadgeWinnersTotalCountApiResponse {
	data: BadgeWinnersTotalCount;
	message: string;
	status: number;
}

export interface ReceivedByBadgeApiResponse {
  data: BadgeAward[];
  message?: string;
  status?: number;
}

export interface BadgeAward {
  orgId_userId: string;
  badge_type_category: string;
  orgId: string;
  userId: string;
  awardedAt: number;
  employeeDetails: EmployeeDetails;
  givenByDetails: GivenByDetails;
}

export interface EmployeeDetails {
  orgId: string;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  joiningDate: string;
  primaryEmail: string;
  primaryPhone: string;
  department: Department;
  designation: Designation;
  grade: Grade;
  active: boolean;
  reportsTo: string;
  directReportee: number;
  totalAward: number;
  totalBadge: number;
  totalRecognition: number;
  totalFeed: number;
}

export interface GivenByDetails {
  type: string;
  givenBy: EmployeeDetailsWithPhoto;
}

export interface EmployeeDetailsWithPhoto extends EmployeeDetails {
  onboardingStatus: boolean;
  photo: string;
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
