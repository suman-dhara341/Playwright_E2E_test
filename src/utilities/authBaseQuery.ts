// utilities/authBaseQuery.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { loginSuccess, logout, setIdToken } from '../modules/authentication/slice';
import { EnvConfig } from '../config/config';

interface AuthState {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  userData: any | null;
}

interface RootState {
  auth: AuthState;
}

const baseQuery = fetchBaseQuery({
  baseUrl: EnvConfig.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const idToken = state.auth?.idToken;
    if (idToken) {
      headers.set('Authorization', `Bearer ${idToken}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth?.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data && typeof refreshResult.data === 'object') {
      const responseData = (refreshResult.data as any).data;

      if (responseData?.accessToken && responseData?.idToken) {
        const { accessToken, idToken } = responseData;

        api.dispatch(setIdToken(idToken));
        api.dispatch(
          loginSuccess({
            accessToken,
            idToken,
            refreshToken,
            userData: state.auth.userData,
          })
        );
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
