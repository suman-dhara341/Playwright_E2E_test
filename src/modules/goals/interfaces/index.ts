export interface ApprovalTrail {
  trailId: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  message: string;
  createdBy: string;
  createdAt: number;
}

export interface Goal {
  orgId_employeeId: string;
  goalId: string;
  title: string;
  description: string;
  tags: string[];
  isApproved: boolean;
  timeline: string;
  dueDate: string;
  completionPercentage: number;
  status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED' | 'APPROVED' | 'PENDING';
  lastUpdated: number;
  lastUpdatedBy?: string;
  approvalTrails?: ApprovalTrail[];
}

export interface GoalsApiResponse {
  data: Goal[];
  message: string;
  status: number;
}
export interface CreateGoal {
  goalName: string;
  goalDescription: string;
  tags: string[];
  // timeline: string;
  dueDate: string;
}

export interface GoalDetails {
  orgId_employeeId: string;
  goalId: string;
  title: string;
  description: string;
  tags: string[];
  isApproved: boolean;
  timeline: string;
  dueDate: string;
  completionPercentage: number;
  status: string;
  lastUpdated: number;
}

export interface GetEmployeeGoalsDetailsResponse {
  data: GoalDetails;
  message: string;
  status: number;
}
export interface EmployeeGoalsTaskCreate {
  taskName: string;
  taskDescription: string;
}

export interface EmployeeGoalsTaskUpdate {
  taskName: string;
  taskDescription: string;
  status: string;
}

export interface GoalsTask {
  taskId: string;
  goalId: string;
  taskName: string;
  taskDescription: string;
  notes: any[];
  completionPercentage: number;
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "APPROVED";
}

export interface GoalsTaskApiResponse {
  data: GoalsTask[];
  message: string;
  status: number;
}

export interface UpdateGoal {
  orgId_employeeId: string;
  goalId: string;
  goalName: string;
  goalDescription: string;
  tags: string[];
  // timeline: string;
  dueDate: string;
  status: string;
}

export interface GoalCommentList {
  taskId: string;
  commentsId: string;
  commentMessage: string;
  commentedBy: string;
  createdAt: number;
}

export interface GoalCommentListResponse {
  data: GoalCommentList[];
  message: string;
  status: number;
}
export interface GoalsCommentCreate {
  commentMessage: string,
  commentedBy: string
}
export interface GoalsCommentUpdate {
    commentsId: string,
    commentMessage: string
}

export interface ApprovalRequest {
  managerId: any;
  message: string;
}
