import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CreateAward,
  UpdateAward,
  AwardReceivedApiResponse,
  AwardApiResponse,
  AwardDescriptionApiResponse,
  AwardRequestPendingListApiResponse,
  AwardWinnersTotalCountApiResponse,
  AwardAcceptanceRateApiResponse,
  AwardRequestsMonthOnMonthApiResponse,
  RejectUserAwardRequest,
  AssignedAwardResponse,
  EmployeeBulkListApiResponse,
  MarketPlaceAwardApiResponse,
  MarketplaceAwardDetails,
} from "../interfaces/index";
import { baseQueryWithReauth } from "../../../utilities/authBaseQuery";

export const awardsApi = createApi({
  reducerPath: "awardsApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAwards: builder.query<
      AwardApiResponse,
      { ORG_ID: string; nextToken: string | null }
    >({
      query: ({ ORG_ID, nextToken }) =>
        `/org/${ORG_ID}/award?maxResults=24${nextToken ? `&nextToken=${nextToken}` : ""
        }`,
    }),
    getMyCreatedAwards: builder.query<
      AwardApiResponse,
      { ORG_ID: string; EMP_ID: string; nextToken: string | null }
    >({
      query: ({ ORG_ID, EMP_ID, nextToken }) =>
        `/org/${ORG_ID}/award?byModerator=${EMP_ID}&maxResults=24${nextToken ? `&nextToken=${nextToken}` : ""
        }`,
    }),
    getMyAwards: builder.query<
      AssignedAwardResponse,
      { ORG_ID: string; EMP_ID: string; nextToken: string | null }
    >({
      query: ({ ORG_ID, EMP_ID, nextToken }) => ({
        url: `/org/${ORG_ID}/award/received-by/${EMP_ID}?withAwardDetail=true&status=assigned&maxResults=24${nextToken ? `&nextToken=${nextToken}` : ""
          }`,
        method: "GET",
      }),
    }),
    getAwardById: builder.query<
      AwardDescriptionApiResponse,
      { ORG_ID: string; EMP_ID: string; awardId: string }
    >({
      query: ({ ORG_ID, EMP_ID, awardId }) =>
        `/org/${ORG_ID}/award/${awardId}?employeeId=${EMP_ID}`,
    }),
    getAwardRecives: builder.query<
      AwardReceivedApiResponse,
      { ORG_ID: string; awardId: string; nextToken: string | null }
    >({
      query: ({ ORG_ID, awardId, nextToken }) =>
        `/org/${ORG_ID}/award/${awardId}/received-by?maxResults=20${nextToken ? `&nextToken=${nextToken}` : ""
        }`,
    }),
    createAward: builder.mutation<
      { message: string },
      { ORG_ID: string; newAward: CreateAward }
    >({
      query: ({ ORG_ID, newAward }) => ({
        url: `/org/${ORG_ID}/award`,
        method: "POST",
        body: newAward,
      }),
    }),
    asignAward: builder.mutation<
      void,
      { ORG_ID: string; awardId: string; awardAsignData: any }
    >({
      query: ({ ORG_ID, awardId, awardAsignData }) => ({
        url: `/org/${ORG_ID}/${awardId}/assign`,
        method: "POST",
        body: awardAsignData,
      }),
    }),
    updateAward: builder.mutation<
      void,
      { ORG_ID: string; awardId: string; updatedAward: UpdateAward }
    >({
      query: ({ ORG_ID, awardId, updatedAward }) => ({
        url: `/org/${ORG_ID}/award/${awardId}`,
        method: "PUT",
        body: updatedAward,
      }),
    }),
    awardRequest: builder.query<
      { message: string },
      { ORG_ID: string; awardId: string; requestDescription: any }
    >({
      query: ({ ORG_ID, awardId, requestDescription }) => ({
        url: `/org/${ORG_ID}/award/${awardId}/award-request`,
        method: "POST",
        body: requestDescription,
      }),
    }),
    awardRequestReject: builder.mutation<
      { message: string },
      {
        ORG_ID: string;
        awardId: string;
        requestDescription: RejectUserAwardRequest;
      }
    >({
      query: ({ ORG_ID, awardId, requestDescription }) => ({
        url: `/org/${ORG_ID}/award/${awardId}/award-reject`,
        method: "POST",
        body: requestDescription,
      }),
    }),
    deleteAward: builder.query<void, { ORG_ID: string; awardId: string }>({
      query: ({ ORG_ID, awardId }) => ({
        url: `/org/${ORG_ID}/award/${awardId}`,
        method: "DELETE",
      }),
    }),
    getAwardsRequestList: builder.query<
      AwardRequestPendingListApiResponse,
      { ORG_ID: string; awardId: string }
    >({
      query: ({ ORG_ID, awardId }) =>
        `/org/${ORG_ID}/award/${awardId}/award-request?status=pending`,
    }),
    awardRequestAssign: builder.query<
      void,
      { ORG_ID: string; awardId: string; awardRequestDescription: any }
    >({
      query: ({ ORG_ID, awardId, awardRequestDescription }) => ({
        url: `/org/${ORG_ID}/award/${awardId}/assign`,
        method: "POST",
        body: awardRequestDescription,
      }),
    }),
    getAwardWinnersTotalCount: builder.query<
      AwardWinnersTotalCountApiResponse,
      { ORG_ID: string; EMP_ID: string; awardId: string }
    >({
      query: ({ ORG_ID, EMP_ID, awardId }) =>
        `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/award-winners-total-count?awardId=${awardId}`,
    }),
    getAwardAcceptanceRate: builder.query<
      AwardAcceptanceRateApiResponse,
      { ORG_ID: string; EMP_ID: string; awardId: string }
    >({
      query: ({ ORG_ID, EMP_ID, awardId }) =>
        `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/award-acceptance-rate?awardId=${awardId}`,
    }),
    getAwardRequestsMonthOnMonth: builder.query<
      AwardRequestsMonthOnMonthApiResponse,
      { ORG_ID: string; EMP_ID: string; awardId: string }
    >({
      query: ({ ORG_ID, EMP_ID, awardId }) =>
        `/org/${ORG_ID}/analytics/user/${EMP_ID}/report-self/award-requests-month-on-month?awardId=${awardId}`,
    }),
    getEmployeeBulkList: builder.query<
      EmployeeBulkListApiResponse,
      { ORG_ID: string; EMPLOYEE_IDS: any }
    >({
      query: ({ ORG_ID, EMPLOYEE_IDS }) => {
        const queryString = EMPLOYEE_IDS.map((id: string) => `id=${id}`).join(
          "&"
        );
        return `/org/${ORG_ID}/employee?${queryString}`;
      },
    }),
    getMarketplaceAward: builder.query<
      MarketPlaceAwardApiResponse,
      { ORG_ID: string, nextToken?: string | null }
    >({
      query: ({ nextToken, ORG_ID }) =>
        `/marketplace/award?orgId=${ORG_ID}&maxResults=24${nextToken ? `&nextToken=${nextToken}` : ""
        }`,
    }),

    getAwardDetails: builder.query<
      MarketplaceAwardDetails,
      { awardId: string, ORG_ID: string, }
    >({
      query: ({ awardId, ORG_ID }) => `marketplace/award/${awardId}?orgId=${ORG_ID}`,
    }),
  }),
});

export const {
  useGetAwardsQuery,
  useGetMyCreatedAwardsQuery,
  useGetMyAwardsQuery,
  useGetAwardByIdQuery,
  useCreateAwardMutation,
  useAsignAwardMutation,
  useUpdateAwardMutation,
  useGetAwardRecivesQuery,
  useLazyAwardRequestQuery,
  useAwardRequestRejectMutation,
  useLazyDeleteAwardQuery,
  useGetAwardsRequestListQuery,
  useLazyAwardRequestAssignQuery,
  useGetAwardWinnersTotalCountQuery,
  useGetAwardAcceptanceRateQuery,
  useGetAwardRequestsMonthOnMonthQuery,
  useLazyGetEmployeeBulkListQuery,
  useGetMarketplaceAwardQuery,
  useGetAwardDetailsQuery,
} = awardsApi;

export type UseGetAwardsQuery = ReturnType<typeof useGetAwardsQuery>;
export type UseGetMyCreatedAwardsQuery = ReturnType<
  typeof useGetMyCreatedAwardsQuery
>;
export type UseGetMyAwardsQuery = ReturnType<typeof useGetMyAwardsQuery>;
export type UseGetAwardByIdQuery = ReturnType<typeof useGetAwardByIdQuery>;
export type UseGetAwardRecivesQuery = ReturnType<
  typeof useGetAwardRecivesQuery
>;
export type UseCreateAwardMutation = ReturnType<typeof useCreateAwardMutation>;
export type UseAsignAwardMutation = ReturnType<typeof useAsignAwardMutation>;
export type UseUpdateAwardMutation = ReturnType<typeof useUpdateAwardMutation>;
export type UseLazyAwardRequestQuery = ReturnType<
  typeof useLazyAwardRequestQuery
>;
export type UseAwardRequestRejectMutation = ReturnType<
  typeof useAwardRequestRejectMutation
>;
export type UseLazyDeleteAwardQuery = ReturnType<
  typeof useLazyDeleteAwardQuery
>;
export type UseGetAwardsRequestListQuery = ReturnType<
  typeof useGetAwardsRequestListQuery
>;
export type UseLazyAwardRequestAssignQuery = ReturnType<
  typeof useLazyAwardRequestAssignQuery
>;
export type UseGetAwardWinnersTotalCountQuery = ReturnType<
  typeof useGetAwardWinnersTotalCountQuery
>;
export type UseGetAwardAcceptanceRateQuery = ReturnType<
  typeof useGetAwardAcceptanceRateQuery
>;
export type UseGetAwardRequestsMonthOnMonthQuery = ReturnType<
  typeof useGetAwardRequestsMonthOnMonthQuery
>;
export type UseLazyGetEmployeeBulkListQuery = ReturnType<
  typeof useLazyGetEmployeeBulkListQuery
>;
export type UseGetMarketplaceAwardQuery = ReturnType<
  typeof useGetMarketplaceAwardQuery
>;

export type UseGetAwardDetailsQuery = ReturnType<
  typeof useGetAwardDetailsQuery
>;
