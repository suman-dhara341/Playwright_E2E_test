import { createApi } from '@reduxjs/toolkit/query/react';
import {
	Badge,
	BadgeApiResponse,
	BadgeDescriptionApiResponse,
	BadgeWinnersTotalCountApiResponse,
	PopularBadgesApiResponse,
	ReceivedByBadgeApiResponse,
} from '../interfaces/index';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const badgesApi = createApi({
	reducerPath: 'badgesApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getBadges: builder.query<BadgeApiResponse, { nextToken: string | null, ORG_ID: string; }>({
			query: ({ nextToken, ORG_ID}) => `/badge?maxResults=24&&orgId=${ORG_ID}&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getBadgeById: builder.query<
			BadgeDescriptionApiResponse,
			{ badgeType: string; badgeCategory: string, ORG_ID:string }
		>({
			query: ({ badgeType, badgeCategory,ORG_ID }) =>
				`/badge/${badgeType}/${badgeCategory}?orgId=${ORG_ID}`,
		}),
		getBadgeByType: builder.query<
			BadgeApiResponse,
			{ badgeType: string; nextToken: string | null }
		>({
			query: ({ badgeType,nextToken}) =>
				`/badge/${badgeType}?maxResults=20&&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getMyBadges: builder.query<
			{
				data: Array<Badge>;
				message: string;
				status: number;
			},
			{ ORG_ID: string; EMP_ID: string }
		>({
			query: ({ ORG_ID, EMP_ID }) =>
				`/badge/user-badges?orgId=${ORG_ID}&userId=${EMP_ID}&maxResults=20&`,
		}),
		receivedByBadge: builder.query<
			{
				data: ReceivedByBadgeApiResponse;
				message: string;
				status: number;
			},
			{ ORG_ID: string; badgeType: string; badgeCategory: string; nextToken: string | null }
		>({
			query: ({ ORG_ID, badgeType, badgeCategory, nextToken }) =>
				`/badge/badge-users?orgId=${ORG_ID}&badgeType=${badgeType}&badgeCategory=${badgeCategory}&maxResults=20&&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getPopularBadges: builder.query<PopularBadgesApiResponse, { ORG_ID: string; EMP_ID: string }>({
			query: ({ ORG_ID, EMP_ID }) => `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/badge-popular-list`,
		}),
		getBadgeWinnersTotalCount: builder.query<BadgeWinnersTotalCountApiResponse, { ORG_ID: string; EMP_ID: string, badgeType: string; badgeCategory: string }>({
			query: ({ ORG_ID, EMP_ID, badgeType, badgeCategory }) => `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/badge-winners-total-count?badgeType=${badgeType}&badgeCategory=${badgeCategory}`,
		}),
	}),
});

export const {
	useGetBadgesQuery,
	useGetBadgeByIdQuery,
	useGetBadgeByTypeQuery,
	useGetMyBadgesQuery,
	useReceivedByBadgeQuery,
	useGetPopularBadgesQuery,
	useGetBadgeWinnersTotalCountQuery
} = badgesApi;
export type UseGetBadgesQuery = ReturnType<typeof useGetBadgesQuery>;
export type UseGetBadgeByIdQuery = ReturnType<typeof useGetBadgeByIdQuery>;
export type UseGetBadgeByTypeQuery = ReturnType<typeof useGetBadgeByTypeQuery>;
export type UseGetMyBadgesQuery = ReturnType<typeof useGetMyBadgesQuery>;
export type UseReceivedByBadgeQuery = ReturnType<
	typeof useReceivedByBadgeQuery
>;
export type UseGetPopularBadgesQuery = ReturnType<typeof useGetPopularBadgesQuery>;
export type UseGetBadgeWinnersTotalCountQuery = ReturnType<typeof useGetBadgeWinnersTotalCountQuery>;
