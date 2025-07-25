import { createApi } from '@reduxjs/toolkit/query/react';
import { DesignationApiResponse, EmployeeSearchResponse, Feedback, NotificationApiResponse, NotificationCount, OrganizationDetailsApiResponse, QuestionApiResponse } from '../interfaces/index';
import { ChangePasswordFormValues, logoutPayload } from '../../authentication/interfaces';
import { baseQueryWithReauth } from '../../../utilities/authBaseQuery';

export const globalApi = createApi({
    reducerPath: 'globalApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getNotificationList: builder.query<NotificationApiResponse, { ORG_ID: string, EMP_ID: string, nextToken?: string | null }>({
            query: ({ ORG_ID, EMP_ID, nextToken }) => {
                const params = new URLSearchParams();
                params.append('userId', EMP_ID);
                params.append('maxResults', '15');
                if (nextToken) {
                    params.append('nextToken', nextToken);
                }
                return `/org/${ORG_ID}/notification?notificationChannel=webnotification&${params.toString()}`;
            },
        }),
        getNotificationCount: builder.query<NotificationCount, { ORG_ID: string, EMP_ID: string }>({
            query: ({ ORG_ID, EMP_ID }) => `/org/${ORG_ID}/notification/unseen?notificationChannel=webnotification&userId=${EMP_ID}`,
        }),
        getAnonymousFeedback: builder.query<QuestionApiResponse, { ORG_ID: string, EMP_ID: string, DATE: any }>({
            query: ({ ORG_ID, EMP_ID, DATE }) => `/org/${ORG_ID}/pulse/user/${EMP_ID}?specificDate=${DATE}`,
        }),
        anonymousFeedback: builder.mutation<void, { ORG_ID: string; feedback: Feedback }>({
            query: ({ ORG_ID, feedback }) => ({
                url: `/org/${ORG_ID}/pulse`,
                method: 'POST',
                body: feedback,
            }),
        }),
        getSearchEmployees: builder.query<EmployeeSearchResponse, { ORG_ID: string; keyword: string, category: string }>({
            query: ({ ORG_ID, keyword, category }) => {
                const params = new URLSearchParams();
                params.append('q', keyword);
                return `/org/${ORG_ID}/${category}/search?${params.toString()}`;
            },
        }),
        getOrganizationDetails: builder.query<OrganizationDetailsApiResponse, string>({
            query: (ORG_ID) => `/org/${ORG_ID}`,
        }),
        getDesignationList: builder.query<DesignationApiResponse, string>({
            query: (ORG_ID) => `/org/${ORG_ID}/config/EMPLOYEE_Designation`,
        }),
        changePassword: builder.mutation<void, { changePasswordDetails: ChangePasswordFormValues }>({
            query: ({ changePasswordDetails }) => ({
                url: `/auth/change-password`,
                method: 'POST',
                body: changePasswordDetails,
            }),
        }),
        logout: builder.mutation<void, { logoutPayload: logoutPayload }>({
            query: ({ logoutPayload }) => ({
                url: `/auth/signout`,
                method: 'POST',
                body: logoutPayload,
            }),
        }),
    }),
});

export const {
    useLazyGetNotificationListQuery,
    useGetNotificationCountQuery,
    useGetAnonymousFeedbackQuery,
    useAnonymousFeedbackMutation,
    useGetSearchEmployeesQuery,
    useGetOrganizationDetailsQuery,
    useGetDesignationListQuery,
    useChangePasswordMutation,
    useLogoutMutation,
} = globalApi;

export type UseLazyGetNotificationListQuery = ReturnType<typeof useLazyGetNotificationListQuery>;
export type UseGetNotificationCountQuery = ReturnType<typeof useGetNotificationCountQuery>;
export type UseGetAnonymousFeedbackQuery = ReturnType<typeof useGetAnonymousFeedbackQuery>;
export type UseAnonymousFeedbackMutation = ReturnType<typeof useAnonymousFeedbackMutation>;
export type UseGetSearchEmployeesQuery = ReturnType<typeof useGetSearchEmployeesQuery>;
export type UseGetOrganizationDetailsQuery = ReturnType<typeof useGetOrganizationDetailsQuery>;
export type UseGetDesignationListQuery = ReturnType<typeof useGetDesignationListQuery>;
export type UseChangePasswordMutation = ReturnType<typeof useChangePasswordMutation>;
export type UseLogoutMutation = ReturnType<typeof useLogoutMutation>;
