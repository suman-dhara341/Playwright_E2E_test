import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ForgotPasswordFormValues, ResendFormValues, SetNewPasswordFormValues, SetNewTempPasswordFormValues, SignInFormValues, SignUpFormValues, verifyFormValues } from '../interfaces';
import { EnvConfig } from '../../../config/config';

export const authenticationApi = createApi({
    reducerPath: 'authenticationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: EnvConfig.apiUrl,
    }),
    endpoints: (builder) => ({
        signUp: builder.mutation<void,{signUpDetails: SignUpFormValues }>({
            query: ({signUpDetails}) => ({
                url: `/auth/signup`,
                method: 'POST',
                body: signUpDetails,
            }),
        }),
        signIn: builder.mutation<void,{signInDetails: SignInFormValues }>({
            query: ({signInDetails}) => ({
                url: `/auth/signin`,
                method: 'POST',
                body: signInDetails,
            }),
        }),
        verify: builder.mutation<void,{verifyDetails: verifyFormValues }>({
            query: ({verifyDetails}) => ({
                url: `/auth/verify`,
                method: 'POST',
                body: verifyDetails,
            }),
        }),
        resend: builder.mutation<void,{resendDetails: ResendFormValues }>({
            query: ({resendDetails}) => ({
                url: `/auth/resend`,
                method: 'POST',
                body: resendDetails,
            }),
        }),
        forgotPassword: builder.mutation<void,{forgotPasswordDetails: ForgotPasswordFormValues }>({
            query: ({forgotPasswordDetails}) => ({
                url: `/auth/forgot-password-request`,
                method: 'POST',
                body: forgotPasswordDetails,
            }),
        }),
        setNewPassword: builder.mutation<void,{setNewPasswordDetails: SetNewPasswordFormValues }>({
            query: ({setNewPasswordDetails}) => ({
                url: `/auth/forgot-password-confirm`,
                method: 'POST',
                body: setNewPasswordDetails,
            }),
        }),
        changeTempPassword: builder.mutation<void,{changePasswordDetails: SetNewTempPasswordFormValues }>({
            query: ({changePasswordDetails}) => ({
                url: `/auth/change-temp-password`,
                method: 'POST',
                body: changePasswordDetails,
            }),
        }),
    }),
});

export const {
    useSignUpMutation,
    useSignInMutation,
    useVerifyMutation,
    useResendMutation,
    useForgotPasswordMutation,
    useSetNewPasswordMutation,
    useChangeTempPasswordMutation,
} = authenticationApi;


export type UseSignUpMutation = ReturnType<typeof useSignUpMutation>;
export type UseSignInMutation = ReturnType<typeof useSignInMutation>;
export type UseVerifyMutation = ReturnType<typeof useVerifyMutation>;
export type UseResendMutation = ReturnType<typeof useResendMutation>;
export type UseForgotPasswordMutation = ReturnType<typeof useForgotPasswordMutation>;
export type UseSetNewPasswordMutation = ReturnType<typeof useSetNewPasswordMutation>;
export type UseChangeTempPasswordMutation = ReturnType<typeof useChangeTempPasswordMutation>;
