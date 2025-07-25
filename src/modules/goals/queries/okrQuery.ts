import { createApi } from '@reduxjs/toolkit/query/react';
import { ApprovalRequest, CreateGoal, EmployeeGoalsTaskCreate, EmployeeGoalsTaskUpdate, GetEmployeeGoalsDetailsResponse, GoalCommentListResponse, GoalsApiResponse, GoalsCommentCreate, GoalsCommentUpdate, GoalsTaskApiResponse, UpdateGoal } from '../interfaces/index';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const okrApi = createApi({
	reducerPath: 'okrApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getEmployeeGoals: builder.query<
			GoalsApiResponse,
			{ ORG_ID: string; EMP_ID: string }
		>({
			query: ({ ORG_ID, EMP_ID }) =>
				`/org/${ORG_ID}/okr/${EMP_ID}/goals`,
		}),
		getEmployeeGoalsByTags: builder.query<
			GoalsApiResponse,
			{ ORG_ID: string; EMP_ID: string; TAG_ID: string }
		>({
			query: ({ ORG_ID, EMP_ID, TAG_ID }) =>
				`/org/${ORG_ID}/okr/${EMP_ID}/goals/tag/${TAG_ID}`,
		}),
		createEmployeeGoals: builder.mutation<void, { ORG_ID: string; EMP_ID: string; goalsDetails: CreateGoal }>({
			query: ({ ORG_ID, EMP_ID, goalsDetails }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals`,
				method: 'POST',
				body: goalsDetails,
			}),
		}),
		getEmployeeGoalsDetails: builder.query<
			GetEmployeeGoalsDetailsResponse,
			{ ORG_ID: string; EMP_ID: string, GOAL_ID: any }
		>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID }) =>
				`/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}`,
		}),
		updateEmployeeGoals: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; goalsDetails: UpdateGoal }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, goalsDetails }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}`,
				method: 'PUT',
				body: goalsDetails,
			}),
		}),
		deleteEmployeeGoals: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string;}>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}`,
				method: 'DELETE',
			}),
		}),
		getEmployeeTask: builder.query<
			GoalsTaskApiResponse,
			{ ORG_ID: string; EMP_ID: string; GOAL_ID: any }
		>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID }) =>
				`/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks`,
		}),
		createEmployeeTask: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string, taskDetails: EmployeeGoalsTaskCreate }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, taskDetails }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks`,
				method: 'POST',
				body: taskDetails,
			}),
		}),
		updateEmployeeTask: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; TASK_ID: string; taskDetails: EmployeeGoalsTaskUpdate }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, TASK_ID, taskDetails }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks/${TASK_ID}`,
				method: 'PUT',
				body: taskDetails,
			}),
		}),
		deleteEmployeeTask: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; TASK_ID: string }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, TASK_ID }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks/${TASK_ID}`,
				method: 'DELETE',
			}),
		}),
		getGoalsCommentsList: builder.query<GoalCommentListResponse, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; TASK_ID: string; }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, TASK_ID }) =>
				`/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks/${TASK_ID}/comments`,
		}),
		createEmployeeGoalsComment: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; TASK_ID: string; commentDetails: GoalsCommentCreate }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, TASK_ID, commentDetails }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks/${TASK_ID}/comments`,
				method: 'POST',
				body: commentDetails,
			}),
		}),
		updateEmployeeGoalsComment: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; TASK_ID: string; COMMENT_ID: string; commentDetails: GoalsCommentUpdate }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, TASK_ID, COMMENT_ID, commentDetails }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks/${TASK_ID}/comments/${COMMENT_ID}`,
				method: 'PUT',
				body: commentDetails,
			}),
		}),
		deleteGoalsComment: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; TASK_ID: string; COMMENT_ID: string }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, TASK_ID, COMMENT_ID }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/tasks/${TASK_ID}/comments/${COMMENT_ID}`,
				method: 'DELETE',
			}),
		}),
		getGoalsPendingApprovalList: builder.query<GoalCommentListResponse, { ORG_ID: string; EMP_ID: string;}>({
			query: ({ ORG_ID, EMP_ID}) =>
				`/org/${ORG_ID}/okr/${EMP_ID}/pending-approval`,
		}),
		requestForApproval: builder.mutation<void, { ORG_ID: string; EMP_ID: string; GOAL_ID: string; approvalData: ApprovalRequest }>({
			query: ({ ORG_ID, EMP_ID, GOAL_ID, approvalData }) => ({
				url: `/org/${ORG_ID}/okr/${EMP_ID}/goals/${GOAL_ID}/approval`,
				method: 'POST',
				body: approvalData,
			}),
		}),
	}),
});

export const {
	useGetEmployeeGoalsQuery,
	useLazyGetEmployeeGoalsByTagsQuery,
	useCreateEmployeeGoalsMutation,
	useGetEmployeeGoalsDetailsQuery,
	useUpdateEmployeeGoalsMutation,
	useDeleteEmployeeGoalsMutation,
	useGetEmployeeTaskQuery,
	useCreateEmployeeTaskMutation,
	useUpdateEmployeeTaskMutation,
	useDeleteEmployeeTaskMutation,
	useGetGoalsCommentsListQuery,
	useCreateEmployeeGoalsCommentMutation,
	useUpdateEmployeeGoalsCommentMutation,
	useDeleteGoalsCommentMutation,
	useGetGoalsPendingApprovalListQuery,
	useRequestForApprovalMutation
} = okrApi;

export type UseGetEmployeeGoalsQuery = ReturnType<typeof useGetEmployeeGoalsQuery>;
export type UseLazyGetEmployeeGoalsByTagsQuery = ReturnType<typeof useLazyGetEmployeeGoalsByTagsQuery>;
export type UseCreateEmployeeGoalsMutation = ReturnType<typeof useCreateEmployeeGoalsMutation>;
export type UseGetEmployeeGoalsDetailsQuery = ReturnType<typeof useGetEmployeeGoalsDetailsQuery>;
export type UseUpdateEmployeeGoalsMutation = ReturnType<typeof useUpdateEmployeeGoalsMutation>;
export type UseDeleteEmployeeGoalsMutation = ReturnType<typeof useDeleteEmployeeGoalsMutation>;
export type UseGetEmployeeTaskQuery = ReturnType<typeof useGetEmployeeTaskQuery>;
export type UseCreateEmployeeTaskMutation = ReturnType<typeof useCreateEmployeeTaskMutation>;
export type UseUpdateEmployeeTaskMutation = ReturnType<typeof useUpdateEmployeeTaskMutation>;
export type UseDeleteEmployeeTaskMutation = ReturnType<typeof useDeleteEmployeeTaskMutation>;
export type UseGetGoalsCommentsListQuery = ReturnType<typeof useGetGoalsCommentsListQuery>;
export type UseCreateEmployeeGoalsCommentMutation = ReturnType<typeof useCreateEmployeeGoalsCommentMutation>;
export type UseDeleteGoalsCommentMutation = ReturnType<typeof useDeleteGoalsCommentMutation>;
export type UseGetGoalsPendingApprovalListQuery = ReturnType<typeof useGetGoalsPendingApprovalListQuery>;
export type UseRequestForApprovalMutation = ReturnType<typeof useRequestForApprovalMutation>;

