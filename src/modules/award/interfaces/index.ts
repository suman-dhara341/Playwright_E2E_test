export interface Award {
  orgId: string;
  awardId: string;
  awardName: string;
  description: string;
  searchKeyword: string;
  criteria: string;
  totalPendingRequest: number;
  totalWinners: number;
  totalRejected: number;
  createdAt: number;
  active: boolean;
}

export interface AwardApiResponse {
  data: Award[];
  message: string;
  status: number;
  nextToken?: string;
}

export interface AwardReceived {
  orgId: string;
  awardId: string;
  awardName: string;
  awardPhoto: string;
  description: string;
  totalPendingRequest: number;
  totalWinners: number;
  createdAt: number;
  moderators: string[];
  active: boolean;
}

export interface AwardReceivedApiResponse {
  data: AwardReceived[];
  message: string;
  status: number;
}
export interface AssignedAward {
  employeeId: string;
  awardDetails?: AwardDetails;
  requestId: string;
  givenBy: string;
  receivedDate: number;
  status: "assigned" | string;
  postToFeed: boolean;
  description: string;
  requestedDate: number;
}

export interface AwardDetails {
  awardId: string;
  awardName: string;
  awardPhoto: string;
  description: string;
  criteria: string;
  totalPendingRequest: number;
  totalWinners: number;
  createdAt: number;
  active: boolean;
}

export interface AssignedAwardResponse {
  data: AssignedAward[];
}

export interface MyRequestStatus {
  description: string;
  receivedDate: number;
  requestedDate: number;
  status: string;
}

export interface Moderator {
  employeeId: string;
  reportsTo: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  primaryEmail: string;
  primaryPhone: string;
  photo: string;
}

export interface AwardDescription {
  myRequestStatus: any;
  orgId: string;
  awardId: string;
  awardName: string;
  awardPhoto: string;
  description: string;
  criteria: string;
  totalPendingRequest: number;
  totalWinners: number;
  createdAt: number;
  moderatorId: Moderator[];
  active: boolean;
}

export interface AwardDescriptionApiResponse {
  data: AwardDescription;
  message: string;
  status: number;
}
export interface FormValues {
  awardName: string;
  description: string;
  criteria: string;
  awardImageContent: any;
  awardPhoto: any;
  moderators: string[];
}

export interface CreateAward {
  awardName: string;
  description: string;
  criteria: string;
  awardImageContent: any;
  moderators: string[];
  awardPhoto: any;
}

export interface UpdateAward {
  awardName?: string;
  description?: string;
  criteria?: string;
  awardPhoto: any;
  awardImageContent: any;
  moderators?: string[];
}

export interface DrawerProps {
  handleDrawerClose: () => void;
  drawerOpen: boolean;
  award: any;
  isLoading?: boolean;
}

export interface MyAwards {
  ORG_ID: string;
  awardId: string;
  createdAt: string;
  active: boolean;
}

export interface MyAwardsApiResponse {
  data: MyAwards;
  message: string;
  status: number;
}
export interface AssignAwardDrawerComponentProps {
  handleAssignAwardDrawerClose: () => void;
  awardAssignDrawerOpen: boolean;
  awardId: string;
  ORG_ID: string;
}
export interface EmployeeDetails {
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
  designation: Designation;
  grade: Grade;
  roleId: string;
  active: boolean;
  onboardingStatus: boolean;
  reportsTo: string;
  directReportee: number;
  totalAward: number;
  totalBadge: number;
  totalRecognition: number;
  totalFeed: number;
  photo?: string;
}

export interface AwardRequestPendingListApiResponse {
  data: AwardRequestPendingItem[];
  message: string;
  status: number;
}

export interface AwardRequestPendingItem {
  requestId: string;
  awardId: string;
  awardReceivedBy: string;
  employeeDetails: EmployeeDetails;
  description: string;
  requestedDate: number;
  status: string;
  moderators: string[];
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

export interface AwardRequestAssign {
  awardReceivedBy: string;
  givenBy: string;
}

export interface AwardWinnersTotalCount {
  total_winners: string;
}

export interface AwardWinnersTotalCountApiResponse {
  data: AwardWinnersTotalCount;
  message: string;
  status: number;
}

export interface AwardAcceptanceRate {
  acceptance_rate: string;
}

export interface AwardAcceptanceRateApiResponse {
  data: AwardAcceptanceRate;
  message: string;
  status: number;
}

export interface AwardRequestByMonth {
  month: string;
  total_requests: string;
}

export interface AwardRequestsMonthOnMonthApiResponse {
  data: AwardRequestByMonth[];
  message: string;
  status: number;
}
export interface RejectUserAwardRequest {
  requestId: string;
  status: string;
  comment: string;
  givenBy: string;
  awardReceivedBy: string;
}

export interface EmployeeBulkListApiResponse {
  data: Employee[];
  message: string;
  status: number;
}

export interface Employee {
  orgId: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  shortDescription?: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  joiningDate: string;
  primaryEmail: string;
  primaryPhone: string;
  department: Department;
  designation: Designation;
  grade: Grade;
  roleId?: string;
  active: boolean;
  onboardingStatus?: boolean;
  reportsTo: string;
  directReportee: number;
  totalAward: number;
  totalBadge: number;
  totalRecognition: number;
  totalFeed: number;
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

export interface MarketPlaceAward {
  awardId: string;
  packId: string;
  awardName: string;
  awardPhoto: string;
  description: string;
  criteria: string;
  category: string[];
  mrp: number;
  createdAt: any;
  updatedAt: number;
  active: boolean;
  existingOrgAwardId?: string;
}

export interface MarketPlaceAwardApiResponse {
  data: MarketPlaceAward[];
  message: string;
  status: number;
  nextToken?: string;
}

export interface MarketplaceAwardDetails {
  data: AwardData;
  message: string;
  status: number;
}

export interface AwardData {
  awardId: string;
  packId: string;
  awardName: string;
  awardPhoto: string;
  description: string;
  criteria: string;
  category: string[];
  mrp: number;
  createdAt: number;
  updatedAt: number;
  active: boolean;
}
