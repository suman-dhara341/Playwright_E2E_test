import { createApi } from '@reduxjs/toolkit/query/react';
import {
	CreateRecognition,
	FeedApiResponse,
	FeedCommentApiResponse,
	FeedCommentFormValues,
	FeedDetailsApiResponse,
	FeedLikeApiResponse,
	LikeListApiResponse,
	RecognitionApiResponse,
} from '../interfaces/index';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const feedsApi = createApi({
	reducerPath: 'feedsApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getFeeds: builder.query<FeedApiResponse, { ORG_ID: string, EMP_ID: string, nextToken: string | null }>({
			query: ({ ORG_ID, EMP_ID, nextToken }) => `/org/${ORG_ID}/feed?employeeId=${EMP_ID}&maxResults=3&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getFeedsById: builder.query<FeedDetailsApiResponse, { ORG_ID: string, FeedId: string }>({
			query: ({ ORG_ID, FeedId }) => `/org/${ORG_ID}/feed/${FeedId}`,
		}),
		getRecognition: builder.query<RecognitionApiResponse, { ORG_ID: string, EMP_ID: string, nextToken: string | null }>({
			query: ({ ORG_ID, EMP_ID, nextToken }) => `/org/${ORG_ID}/feed?type=Recognition&employeeId=${EMP_ID}&maxResults=3&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getMyRecognition: builder.query<RecognitionApiResponse, { ORG_ID: string, EMP_ID: string, nextToken: string | null }>({
			query: ({ ORG_ID, EMP_ID, nextToken }) => `/org/${ORG_ID}/feed/received-by/${EMP_ID}?type=Recognition&maxResults=3&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getFeedLike: builder.query<
			FeedLikeApiResponse,
			{
				ORG_ID: string;
				EMP_ID: string;
				feedId: string;
			}
		>({
			query: ({ ORG_ID, feedId, EMP_ID }) => ({
				url: `/org/${ORG_ID}/feed/${feedId}/likes?employeeId=${EMP_ID}`,
				method: 'POST',
			}),
		}),
		getFeedLikeList: builder.query<
			LikeListApiResponse,
			{ ORG_ID: string; feedId: string }
		>({
			query: ({ ORG_ID, feedId }) => `/org/${ORG_ID}/feed/${feedId}/likes`,
		}),
		feedComment: builder.mutation<
			void,
			{
				ORG_ID: string;
				feedCommentData: FeedCommentFormValues;
				feedId: string;
			}
		>({
			query: ({ ORG_ID, feedId, feedCommentData }) => ({
				url: `/org/${ORG_ID}/feed/${feedId}/comment`,
				method: 'POST',
				body: feedCommentData,
			}),
		}),
		getFeedCommentList: builder.query<
			FeedCommentApiResponse,
			{ ORG_ID: string; feedId: string, nextTokenComment: any }
		>({
			query: ({ ORG_ID, feedId, nextTokenComment }) =>
				`/org/${ORG_ID}/feed/${feedId}/comment?maxResults=10&${nextTokenComment ? `&nextToken=${nextTokenComment}` : ''}`,
		}),
		createRecognition: builder.mutation<void, { ORG_ID: string; newRecognition: CreateRecognition }>({
			query: ({ ORG_ID, newRecognition }) => ({
				url: `org/${ORG_ID}/recognition`,
				method: 'POST',
				body: newRecognition,
			}),
		})
	}),
});

export const {
	useGetFeedsQuery,
	useGetFeedsByIdQuery,
	useGetRecognitionQuery,
	useGetMyRecognitionQuery,
	useLazyGetFeedLikeQuery,
	useLazyGetFeedLikeListQuery,
	useFeedCommentMutation,
	useGetFeedCommentListQuery,
	useCreateRecognitionMutation
} = feedsApi;

export type UseGetFeedsQuery = ReturnType<typeof useGetFeedsQuery>;
export type UseGetFeedsByIdQuery = ReturnType<typeof useGetFeedsByIdQuery>;
export type UseGetRecognitionQuery = ReturnType<typeof useGetRecognitionQuery>;
export type UseGetMyRecognitionQuery = ReturnType<typeof useGetRecognitionQuery>;
export type UseLazyGetFeedLikeQuery = ReturnType<typeof useLazyGetFeedLikeQuery>;
export type UseLazyGetFeedLikeListQuery = ReturnType<typeof useLazyGetFeedLikeListQuery>;
export type UseFeedCommentMutation = ReturnType<typeof useFeedCommentMutation>;
export type UseGetFeedCommentListQuery = ReturnType<typeof useGetFeedCommentListQuery>;
export type UseCreateRecognitionMutation = ReturnType<typeof useCreateRecognitionMutation>;
