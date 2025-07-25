import { createApi } from '@reduxjs/toolkit/query/react';
import { CalenderApiResponse, ContactListResponse, employeeImageUploadData, FeedbackApiResponse, OrgHierarchyEmployeeResponse, RecognitionApiResponse, EmployeeJourneyApiResponse, UpdateEmployeeDetails, EmployeeAddressListApiResponse, EmployeeContact, EmployeeAddressData, AllAreaWiseReport, TotalAwardInsightResponse, TotalBadgeInsightResponse, TotalRecognitionInsightResponse, TotalFeedInsightResponse, TotalFeedLikeInsightResponse, TotalFeedCommentInsightResponse, ActivityResponse, EmployeeProfileApiResponse } from '../interfaces/index';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const profileApi = createApi({
	reducerPath: 'profileApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Profile'],
	endpoints: (builder) => ({
		getProfile: builder.query<
			EmployeeProfileApiResponse,
			{ ORG_ID: string; EMP_ID: string }
		>({
			query: ({ ORG_ID, EMP_ID }) =>
				`/org/${ORG_ID}/employee/${EMP_ID}`,
		}),
		getProfileDetails: builder.query<
			EmployeeProfileApiResponse,
			{ ORG_ID: string; reportsTo: string }
		>({
			query: ({ ORG_ID, reportsTo }) =>
				`/org/${ORG_ID}/employee/${reportsTo}`,
		}),
		getEmployeeJourney: builder.query<EmployeeJourneyApiResponse, { ORG_ID: string; EMP_ID: string }>({
			query: ({ EMP_ID, ORG_ID }) =>
				`/org/${ORG_ID}/employee/${EMP_ID}/journey`,
		}),
		uploadEmployeeProfileImage: builder.mutation<void, { ORG_ID: string; EMP_ID: string; profileImage: employeeImageUploadData }>({
			query: ({ ORG_ID, EMP_ID, profileImage }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/avatar`,
				method: 'POST',
				body: profileImage,
			}),
			invalidatesTags: (_result, _error, { EMP_ID }) => [{ type: 'Profile' as const, id: EMP_ID }],
		}),
		getMyRecognition: builder.query<RecognitionApiResponse, { recognitionType: string; ORG_ID: string; EMP_ID: string; nextToken: string | null }>({
			query: ({ recognitionType, EMP_ID, ORG_ID, nextToken }) =>
				`/org/${ORG_ID}/recognition/${recognitionType}/${EMP_ID}?type=Recognition&maxResults=10&${nextToken ? `nextToken=${nextToken}` : ''}`
		}),
		getFeedbackReport: builder.query<CalenderApiResponse, { ORG_ID: string; EMP_ID: string, DATE_ONE: any, DATE_TWO: any }>({
			query: ({ ORG_ID, EMP_ID, DATE_ONE, DATE_TWO }) =>
				`/org/${ORG_ID}/pulse/user/${EMP_ID}?fromDate=${DATE_ONE}&toDate=${DATE_TWO}`,
		}),
		getAreaWiseReport: builder.query<FeedbackApiResponse, { ORG_ID: string; EMP_ID: string, DATE_ONE: any, DATE_TWO: any }>({
			query: ({ ORG_ID, EMP_ID, DATE_ONE, DATE_TWO }) =>
				`/org/${ORG_ID}/pulse/report?employeeId=${EMP_ID}&fromDate=${DATE_ONE}&toDate=${DATE_TWO}&reportType=areaWise`,
		}),
		getAreaWiseQuestion: builder.query<FeedbackApiResponse, { ORG_ID: string; EMP_ID: string, DATE_ONE: any, DATE_TWO: any, AREA_ID: any }>({
			query: ({ ORG_ID, EMP_ID, DATE_ONE, DATE_TWO, AREA_ID }) =>
				`/org/${ORG_ID}/pulse/report?areaId=${AREA_ID}&employeeId=${EMP_ID}&fromDate=${DATE_ONE}&toDate=${DATE_TWO}&reportType=areaWiseQuestion`,
		}),
		getAllAreaWiseReport: builder.query<AllAreaWiseReport, { ORG_ID: string; EMP_ID: string, DATE_ONE: any, DATE_TWO: any }>({
			query: ({ ORG_ID, EMP_ID, DATE_ONE, DATE_TWO }) =>
				`/org/${ORG_ID}/pulse/report?employeeId=${EMP_ID}&fromDate=${DATE_ONE}&toDate=${DATE_TWO}&reportType=areaWise`,
		}),
		getOrgHierarchy: builder.query<OrgHierarchyEmployeeResponse, { ORG_ID: string, EMP_ID: string, hierarchyType: string }>({
			query: ({ ORG_ID, EMP_ID, hierarchyType }) => `/org/${ORG_ID}/employee/${EMP_ID}/hierarchy?type=${hierarchyType}`,
		}),
		updateEmployeeDetails: builder.mutation<
			{ message: string },
			{ ORG_ID: string; EMP_ID: string; updatedEmployee: UpdateEmployeeDetails }
		>({
			query: ({ ORG_ID, EMP_ID, updatedEmployee }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}`,
				method: 'PUT',
				body: updatedEmployee,
			}),
		}),
		getContactList: builder.query<ContactListResponse, { ORG_ID: string; EMP_ID: string }>({
			query: ({ ORG_ID, EMP_ID }) => `/org/${ORG_ID}/employee/${EMP_ID}/contact`,
		}),
		createContactList: builder.mutation<
			{ message: string },
			{ ORG_ID: string; EMP_ID: string; createEmployeeContact: EmployeeContact }
		>({
			query: ({ ORG_ID, EMP_ID, createEmployeeContact }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/contact`,
				method: 'POST',
				body: createEmployeeContact,
			}),
		}),
		updateContactList: builder.mutation<
			{ message: string },
			{ ORG_ID: string; EMP_ID: string; Contact_ID: string, updatedEmployeeContact: EmployeeContact }
		>({
			query: ({ ORG_ID, EMP_ID, Contact_ID, updatedEmployeeContact }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/contact/${Contact_ID}`,
				method: 'PUT',
				body: updatedEmployeeContact,
			}),
		}),
		deleteContactList: builder.query<void, { ORG_ID: string; EMP_ID: string, Contact_ID: string }>({
			query: ({ ORG_ID, EMP_ID, Contact_ID }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/contact/${Contact_ID}`,
				method: 'DELETE',
			})
		}),
		getEmployeeAddress: builder.query<EmployeeAddressListApiResponse, { ORG_ID: string; EMP_ID: string }>({
			query: ({ ORG_ID, EMP_ID }) => `/org/${ORG_ID}/employee/${EMP_ID}/address`,
		}),
		createEmployeeAddress: builder.mutation<
			{ message: string },
			{ ORG_ID: string; EMP_ID: string; createEmployeeAddress: EmployeeAddressData }
		>({
			query: ({ ORG_ID, EMP_ID, createEmployeeAddress }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/address`,
				method: 'POST',
				body: createEmployeeAddress,
			}),
		}),
		updateEmployeeAddress: builder.mutation<
			{ message: string },
			{ ORG_ID: string; EMP_ID: string; Address_ID: string, updatedEmployeeAddress: EmployeeAddressData }
		>({
			query: ({ ORG_ID, EMP_ID, Address_ID, updatedEmployeeAddress }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/address/${Address_ID}`,
				method: 'PUT',
				body: updatedEmployeeAddress,
			}),
		}),
		deleteEmployeeAddress: builder.query<void, { ORG_ID: string; EMP_ID: string, Address_ID: string }>({
			query: ({ ORG_ID, EMP_ID, Address_ID }) => ({
				url: `/org/${ORG_ID}/employee/${EMP_ID}/address/${Address_ID}`,
				method: 'DELETE',
			})
		}),
		getProfileInsightTotalAward: builder.query<TotalAwardInsightResponse, { ORG_ID: string, EMP_ID: string, PERIOD: string, USER_TYPE: string }>({
			query: ({ ORG_ID, EMP_ID, PERIOD, USER_TYPE }) =>
				`/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/awards-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}`,
		}),
		getProfileInsightTotalBadge: builder.query<TotalBadgeInsightResponse, { ORG_ID: string, EMP_ID: string, PERIOD: string, USER_TYPE: string }>({
			query: ({ ORG_ID, EMP_ID, PERIOD, USER_TYPE }) =>
				`/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/badges-received-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}`,
		}),
		getProfileInsightTotalRecognition: builder.query<TotalRecognitionInsightResponse, { ORG_ID: string, EMP_ID: string, PERIOD: string, USER_TYPE: string }>({
			query: ({ ORG_ID, EMP_ID, PERIOD, USER_TYPE }) =>
				`/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/recognitions-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}`,
		}),
		getProfileInsightTotalFeed: builder.query<TotalFeedInsightResponse, { ORG_ID: string, EMP_ID: string, PERIOD: string, USER_TYPE: string }>({
			query: ({ ORG_ID, EMP_ID, PERIOD, USER_TYPE }) =>
				`/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/feeds-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}`,
		}),
		getProfileInsightTotalFeedLike: builder.query<TotalFeedLikeInsightResponse, { ORG_ID: string, EMP_ID: string, PERIOD: string, USER_TYPE: string }>({
			query: ({ ORG_ID, EMP_ID, PERIOD, USER_TYPE }) =>
				`/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/feed-likes-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}`,
		}),
		getProfileInsightTotalFeedComment: builder.query<TotalFeedCommentInsightResponse, { ORG_ID: string, EMP_ID: string, PERIOD: string, USER_TYPE: string }>({
			query: ({ ORG_ID, EMP_ID, PERIOD, USER_TYPE }) =>
				`/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/feed-comments-received-or-given-x-period-month-on-month?period=${PERIOD}&userType=${USER_TYPE}`,
		}),
		getEmployeeActivity: builder.query<ActivityResponse, { ORG_ID: string, EMP_ID: string, nextToken: string | null}>({
			query: ({ ORG_ID, EMP_ID, nextToken }) =>
				`/org/${ORG_ID}/notification/activity?userId=${EMP_ID}&maxResults=20&${nextToken ? `nextToken=${nextToken}` : ''}`,
		}),
		getAddressDetails: builder.query<any,{ ORG_ID: string, addressId: string}>({
			query: ({ORG_ID,addressId}) => `/org/${ORG_ID}/address/${addressId}`,
		}),
	}),
});

export const {
	useGetProfileQuery,
	useGetProfileDetailsQuery,
	useGetEmployeeJourneyQuery,
	useGetMyRecognitionQuery,
	useUploadEmployeeProfileImageMutation,
	useGetFeedbackReportQuery,
	useGetAreaWiseReportQuery,
	useGetAllAreaWiseReportQuery,
	useGetAreaWiseQuestionQuery,
	useGetOrgHierarchyQuery,
	useUpdateEmployeeDetailsMutation,
	useGetContactListQuery,
	useUpdateContactListMutation,
	useLazyDeleteContactListQuery,
	useGetEmployeeAddressQuery,
	useCreateEmployeeAddressMutation,
	useUpdateEmployeeAddressMutation,
	useLazyDeleteEmployeeAddressQuery,
	useGetProfileInsightTotalAwardQuery,
	useGetProfileInsightTotalBadgeQuery,
	useGetProfileInsightTotalRecognitionQuery,
	useGetProfileInsightTotalFeedQuery,
	useGetProfileInsightTotalFeedLikeQuery,
	useGetProfileInsightTotalFeedCommentQuery,
	useGetEmployeeActivityQuery,
	useGetAddressDetailsQuery,
} = profileApi;

export type UseGetProfileQuery = ReturnType<typeof useGetProfileQuery>;
export type UseGetProfileDetailsQuery = ReturnType<typeof useGetProfileDetailsQuery>;
export type UseGetEmployeeJourneyQuery = ReturnType<typeof useGetEmployeeJourneyQuery>;
export type UseGetMyRecognitionQuery = ReturnType<typeof useGetMyRecognitionQuery>;
export type UseUploadEmployeeProfileImageMutation = ReturnType<typeof useUploadEmployeeProfileImageMutation>;
export type UseGetFeedbackReportQuery = ReturnType<typeof useGetFeedbackReportQuery>;
export type UseGetAreaWiseReportQuery = ReturnType<typeof useGetAreaWiseReportQuery>;
export type UseGetAllAreaWiseReportQuery = ReturnType<typeof useGetAllAreaWiseReportQuery>;
export type UseGetAreaWiseQuestionQuery = ReturnType<typeof useGetAreaWiseQuestionQuery>;
export type UseGetOrgHierarchyQuery = ReturnType<typeof useGetOrgHierarchyQuery>;
export type UseUpdateEmployeeDetailsMutation = ReturnType<typeof useUpdateEmployeeDetailsMutation>
export type UseGetContactListQuery = ReturnType<typeof useGetContactListQuery>
export type UseUpdateContactListMutation = ReturnType<typeof useUpdateContactListMutation>
export type UseLazyDeleteContactListQuery = ReturnType<typeof useLazyDeleteContactListQuery>
export type UseGetEmployeeAddressQuery = ReturnType<typeof useGetContactListQuery>
export type UseCreateEmployeeAddressMutation = ReturnType<typeof useCreateEmployeeAddressMutation>
export type UseUpdateEmployeeAddressMutation = ReturnType<typeof useUpdateContactListMutation>
export type UseLazyDeleteEmployeeAddressQuery = ReturnType<typeof useLazyDeleteContactListQuery>
export type UseGetProfileInsightTotalAwardQuery = ReturnType<typeof useGetProfileInsightTotalAwardQuery>
export type UseGetProfileInsightTotalBadgeQuery = ReturnType<typeof useGetProfileInsightTotalBadgeQuery>
export type UseGetProfileInsightTotalRecognitionQuery = ReturnType<typeof useGetProfileInsightTotalRecognitionQuery>
export type UseGetProfileInsightTotalFeedQuery = ReturnType<typeof useGetProfileInsightTotalFeedQuery>
export type UseGetProfileInsightTotalFeedLikeQuery = ReturnType<typeof useGetProfileInsightTotalFeedLikeQuery>
export type UseGetProfileInsightTotalFeedCommentQuery = ReturnType<typeof useGetProfileInsightTotalFeedCommentQuery>
export type UseGetEmployeeActivityQuery = ReturnType<typeof useGetEmployeeActivityQuery>
export type UseGetAddressDetailsQuery = ReturnType<typeof useGetAddressDetailsQuery>

