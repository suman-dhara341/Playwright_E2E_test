export interface Option {
  optionText: string;
  weight: number;
  nextQuestionId: string;
  relateTo: string;
}
export interface QuestionData {
  questionId: string;
  flagAreaId: string;
  areaId: string;
  questionType?: string;
  questionText: string;
  options: Option[];
  createdTimestamp: string;
  maxResponseLength: number;
  type?: string
}
export interface AnonymousFeedbackApiResponse {
  data: QuestionData;
  message: string;
  status: number;
}

export interface FeedbackOption {
  optionText: string;
  weight: number;
  nextQuestionId: string;
  relateTo: string;
}

export interface FeedbackQuestion {
  questionId: string;
  areaId: string;
  type?: string;
  questionType?: string;
  questionText: string;
  options: Option[];
  answer: string;
  point: number;
}

export interface Feedback {
  orgId: string;
  feedbackDate: string;
  employeeId: string;
  managerId: string;
  relateTo: string;
  questionsFeedback: FeedbackQuestion[];
}

export interface EmployeeSearch {
  orgId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeAvatar: string;
  employeeStatus: string;
}

export interface EmployeeSearchResponse {
  data: EmployeeSearch[];
  message: string;
  status: number;
}
export interface AwardSearch {
  orgId: string;
  awardId: string;
  awardName: string;
  awardPhoto: string;
  totalPendingRequest: number;
  totalWinners: number;
}
export interface AwardSearchResponse {
  data: AwardSearch[];
  message: string;
  status: number;
}

export type SearchResponse = EmployeeSearchResponse | AwardSearchResponse;
export interface QuestionDetails {
  questionId: string;
  flagAreaId: string;
  areaId: string;
  type: string;
  questionType: string;
  questionText: string;
  options: Option[];
  monthlyLimit: string;
  createdTimestamp: string;
  maxResponseLength: number;
}

export interface QuestionData {
  questionId: string;
  questionDetails: QuestionDetails;
  status: string;
}

export interface QuestionApiResponse {
  data: QuestionData;
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
  photo: string;
}

export interface NotificationVariables {
  comment?: string;
  badgeDetails?: string;
  recognitionDetails?: string;
}

export interface Notification {
  serviceRecordId: string;
  notificationId: string;
  orgId: string;
  fromEmployeeDetail: EmployeeDetail;
  toEmployeeDetail: EmployeeDetail;
  taggedEmployee: string[];
  notificationChannel: string;
  notificationType: string;
  notificationSlug: string;
  notificationFor: string;
  messageTitle: string;
  messageBody: string;
  deliveredAt: string;
  status: string;
  createdAt: number;
  variables?: NotificationVariables;
}

export interface NotificationApiResponse {
  data: Notification[];
  message: string;
  status: number;
  nextToken: any;
}

export interface NotificationCount {
  message: string;
  status: number;
}

export interface OrganizationDetailsApiResponse {
  data: any;
  message: string;
  status: number;
}

export interface DesignationDataList {
  designationName: string;
  designationCode: string;
  jobDescription : string;
  employeeTitle : string;
  entityId: string;
  version: number;
  createdAt: number;
}

export interface DesignationApiResponse {
  data: DesignationDataList[];
  message: string;
  status: number;
}