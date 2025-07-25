export interface ConversationInfo {
    description: string;
    growthAreas: string[];
  }
  
  export interface EmployeeConversation {
    employeeId: string;
    conversationId: string;
    managerId: string;
    conversationTitle: string;
    conversationInfo: ConversationInfo;
    initialManagerId: string;
    createdAt: number;
    updatedAt: number;
    status: string;
  }
  
  export interface GetEmployeeConversationResponse {
    data: EmployeeConversation[];
    message: string;
    status: number;
  }
  
  export interface ConversationData {
    conversationId?: string;
    employeeId: string;
    managerId: string;
    conversationTitle: string;
    conversationInfo: {
      description: string;
      growthAreas: string[];
    };
  }

  export interface Discussion {
    discussionId: string;
    overview: string;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
  }
  
  export interface ConversationInfo {
    description: string;
    growthAreas: string[];
  }
  
  export interface EmployeeConversationDetails {
    employeeId: string;
    conversationId: string;
    managerId: string;
    conversationTitle: string;
    conversationInfo: ConversationInfo;
    discussions: Discussion[];
    initialManagerId: string;
    createdAt: number;
    updatedAt: number;
    status: string;
  }
  
  export interface EmployeeConversationDetailsApiResponse {
    data: EmployeeConversationDetails;
    message: string;
    status: number;
  }
  
  export interface DiscussionCreateData {
    overview: string,
    createdBy: string
  }

  export interface DiscussionUpdateData {
    discussionId: string,
    overview: string,
  }
  
  export interface Comment {
    discussionId: string;
    commentsId: string;
    commentMessage: string;
    commentedBy: string;
    createdAt: number;
  }
  export interface CommentListResponse {
    data: Comment[];
    message: string;
    status: number;
  }
  export interface CommentData{
    commentMessage : string,
    commentedBy : string
  }

  export interface CommentUpdateData{
    commentId : string,
    commentMessage : string
  }