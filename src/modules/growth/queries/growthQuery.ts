import { createApi } from '@reduxjs/toolkit/query/react';
import { CommentData, CommentListResponse, CommentUpdateData, ConversationData, DiscussionCreateData, DiscussionUpdateData, EmployeeConversationDetailsApiResponse, GetEmployeeConversationResponse } from '../interfaces/index';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const growthApi = createApi({
    reducerPath: 'growthApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getEmployeeConversation: builder.query<
            GetEmployeeConversationResponse,
            { ORG_ID: string; EMP_ID: string }
        >({
            query: ({ ORG_ID, EMP_ID }) =>
                `/org/${ORG_ID}/growth/${EMP_ID}/conversations`,
        }),
        createEmployeeConversation: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationDetails: ConversationData }>({
            query: ({ ORG_ID, EMP_ID, conversationDetails }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations`,
                method: 'POST',
                body: conversationDetails,
            }),
        }),
        updateEmployeeConversation: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: string; conversationDetails: ConversationData }>({
            query: ({ ORG_ID, EMP_ID, conversationId, conversationDetails }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}`,
                method: 'PUT',
                body: conversationDetails,
            }),
        }),
        deleteEmployeeConversation: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: string; }>({
            query: ({ ORG_ID, EMP_ID, conversationId }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}`,
                method: 'DELETE',
            }),
        }),
        getEmployeeConversationDetails: builder.query<
        EmployeeConversationDetailsApiResponse,
            { ORG_ID: string; EMP_ID: string; conversationId: any }
        >({
            query: ({ ORG_ID, EMP_ID, conversationId }) =>
                `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}`,
        }),
        createEmployeediscussion: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: any; discussionDetails: DiscussionCreateData }>({
            query: ({ ORG_ID, EMP_ID, conversationId, discussionDetails }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}/discussion`,
                method: 'POST',
                body: discussionDetails,
            }),
        }),
        updateEmployeediscussion: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: any;discussionId:string; discussionDetails: DiscussionUpdateData }>({
            query: ({ ORG_ID, EMP_ID, conversationId, discussionId, discussionDetails }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}/discussion/${discussionId}`,
                method: 'PUT',
                body: discussionDetails,
            }),
        }),
        getCommentList: builder.query<
            CommentListResponse,
            { ORG_ID: string; EMP_ID: string, conversationId:string, discussionId: string}
        >({
            query: ({ ORG_ID, EMP_ID, conversationId, discussionId }) =>
                `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}/discussion/${discussionId}/comments`,
        }),
        createComment: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: any; discussionId:any; commentData: CommentData }>({
            query: ({ ORG_ID, EMP_ID, conversationId, discussionId, commentData }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}/discussion/${discussionId}/comments`,
                method: 'POST',
                body: commentData,
            }),
        }),
        updateComment: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: any; discussionId:string; commentId:string; commentData: CommentUpdateData }>({
            query: ({ ORG_ID, EMP_ID, conversationId, discussionId, commentId, commentData }) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}/discussion/${discussionId}/comments/${commentId}`,
                method: 'PUT',
                body: commentData,
            }),
        }),
        deleteComment: builder.mutation<void, { ORG_ID: string; EMP_ID: string; conversationId: string; discussionId:string; commentId:string }>({
            query: ({ ORG_ID, EMP_ID, conversationId, discussionId, commentId}) => ({
                url: `/org/${ORG_ID}/growth/${EMP_ID}/conversations/${conversationId}/discussion/${discussionId}/comments/${commentId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetEmployeeConversationQuery,
    useCreateEmployeeConversationMutation,
    useUpdateEmployeeConversationMutation,
    useDeleteEmployeeConversationMutation,
    useGetEmployeeConversationDetailsQuery,
    useCreateEmployeediscussionMutation,
    useUpdateEmployeediscussionMutation,
    useGetCommentListQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = growthApi;

export type UseGetEmployeeConversationQuery = ReturnType<typeof useGetEmployeeConversationQuery>;
export type UseCreateEmployeeConversationMutation = ReturnType<typeof useCreateEmployeeConversationMutation>;
export type UseUpdateEmployeeConversationMutation = ReturnType<typeof useUpdateEmployeeConversationMutation>;
export type UseDeleteEmployeeConversationMutation = ReturnType<typeof useDeleteEmployeeConversationMutation>;
export type UseGetEmployeeConversationDetailsQuery = ReturnType<typeof useGetEmployeeConversationDetailsQuery>;
export type UseCreateEmployeediscussionMutation = ReturnType<typeof useCreateEmployeediscussionMutation>;
export type UseUpdateEmployeediscussionMutation = ReturnType<typeof useUpdateEmployeediscussionMutation>;
export type UseGetCommentListQuery = ReturnType<typeof useGetCommentListQuery>;
export type UseCreateCommentMutation = ReturnType<typeof useCreateCommentMutation>;
export type UseUpdateCommentMutation = ReturnType<typeof useUpdateCommentMutation>;
export type UseDeleteCommentMutation = ReturnType<typeof useDeleteCommentMutation>;


