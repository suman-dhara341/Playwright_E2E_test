import { createApi } from '@reduxjs/toolkit/query/react';
import {
	EmployeeAggregateReportApiResponse,
	ManagerHubTotalRecognitionApiResponse,
	ManagerHubTotalBadgeApiResponse,
	ManagerHubTotalAwardApiResponse,
	EmployeeSearchApiResponse,
} from '../interfaces/index';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const analyticsApi = createApi({
	reducerPath: 'analyticsApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getRecognition: builder.query<ManagerHubTotalRecognitionApiResponse, {ORG_ID:string,EMP_ID:string,USER_ID:string,VALUE:string,PERIOD:string,REPORTS_TO:string,USER_TYPE:string}>({
			query: ({ORG_ID,EMP_ID,USER_ID,VALUE,PERIOD,USER_TYPE}) => `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-team/team-recognitions-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}&empIds=${USER_ID}${VALUE ? `&topN=${VALUE}` : ''}`,
		}),
        getAward: builder.query<ManagerHubTotalAwardApiResponse, {ORG_ID:string,EMP_ID:string,USER_ID:string,VALUE:string,PERIOD:string,REPORTS_TO:string,USER_TYPE:string}>({
			query: ({ORG_ID,EMP_ID,USER_ID,VALUE,PERIOD,USER_TYPE}) => `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-team/team-awards-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}&empIds=${USER_ID}${VALUE ? `&topN=${VALUE}` : ''}`,
		}),
        getBadge: builder.query<ManagerHubTotalBadgeApiResponse, {ORG_ID:string,EMP_ID:string,USER_ID:string,VALUE:string,PERIOD:string,REPORTS_TO:string,USER_TYPE:string}>({
			query: ({ORG_ID,EMP_ID,USER_ID,VALUE,PERIOD,USER_TYPE}) => `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-team/team-badges-received-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}&empIds=${USER_ID}${VALUE ? `&topN=${VALUE}` : ''}`,
		}),
		getAggregateAllTypesMonthOnMonthTotals: builder.query<EmployeeAggregateReportApiResponse,{ORG_ID:string,EMP_ID:string,PERIOD:string,USER_ID:string}>({
			query: ({ORG_ID,EMP_ID,PERIOD,USER_ID}) => `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/aggregated-recognitions-badges-awards-received-x-period-month-on-month?period=${PERIOD}&userId=${USER_ID}`,
		}),
		getSearchEmployeesManagerhub: builder.query<EmployeeSearchApiResponse, { ORG_ID: string; keyword: string, EMP_ID:string }>({
			query: ({ ORG_ID, EMP_ID, keyword }) => {
				const params = new URLSearchParams();
				params.append('q', keyword);
				return `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-team/team-employee-search?${params.toString()}`;
			},
		}),
	}),
});

export const {
	useGetRecognitionQuery,
    useGetAwardQuery,
	useGetBadgeQuery,
	useLazyGetAggregateAllTypesMonthOnMonthTotalsQuery,
	useGetSearchEmployeesManagerhubQuery,
} = analyticsApi;

export type UseGetRecognitionQueryQuery = ReturnType<typeof useGetRecognitionQuery>;
export type UseGetAwardQueryQuery = ReturnType<typeof useGetAwardQuery>;
export type UseGetBadgeQueryQuery = ReturnType<typeof useGetBadgeQuery>;
export type UseLazyGetAggregateAllTypesMonthOnMonthTotalsQuery = ReturnType<typeof useLazyGetAggregateAllTypesMonthOnMonthTotalsQuery>;
export type UseGetSearchEmployeesManagerhubQuery = ReturnType<typeof useGetSearchEmployeesManagerhubQuery>;