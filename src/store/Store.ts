import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import feedProfileReducer from '../modules/feeds/slice/feedProfileSlice';
import persistedAvatarReducer from '../modules/feeds/slice/avatarSlice';
import persistedAuthReducer from '../modules/authentication/slice/index';
import tabReducer from '../modules/profile/slice/tabSlice'
import { awardsApi } from '../modules/award/queries/awardQuery';
import { badgesApi } from '../modules/badge/queries/badgeQuery';
import { profileApi } from '../modules/profile/queries/profileQuery';
import { feedsApi } from '../modules/feeds/queries/feedQuery';
import { authenticationApi } from '../modules/authentication/queries/authenticationQuery';
import { persistStore } from 'redux-persist';
import { globalApi } from '../modules/global/queries/globalQuery';
import webSocketReducer from '../modules/global/slice/webSocketSlice';
import webSocketMiddleware from '../modules/global/middleware/webSocketMiddleware';
import modalReducer from "../modules/global/slice/modalSlice";
import onboardingReducer from "../modules/global/slice/onboardingSlice";
import messageReducer from "../modules/global/slice/messageSlice";
import { okrApi } from '../modules/goals/queries/okrQuery';
import { analyticsApi } from '../modules/managerHub/queries/managerhubQuery';
import { growthApi } from '../modules/growth/queries/growthQuery';


const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    feedProfile: feedProfileReducer,
    avatar: persistedAvatarReducer,
    webSocket: webSocketReducer,
    modal: modalReducer,
    onboarding: onboardingReducer,
    tabs: tabReducer,
    message: messageReducer,
    [awardsApi.reducerPath]: awardsApi.reducer,
    [badgesApi.reducerPath]: badgesApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [feedsApi.reducerPath]: feedsApi.reducer,
    [authenticationApi.reducerPath]: authenticationApi.reducer,
    [globalApi.reducerPath]: globalApi.reducer,
    [okrApi.reducerPath]: okrApi.reducer,
    [growthApi.reducerPath]: growthApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      awardsApi.middleware,
      badgesApi.middleware,
      profileApi.middleware,
      feedsApi.middleware,
      authenticationApi.middleware,
      globalApi.middleware,
      okrApi.middleware,
      growthApi.middleware,
      analyticsApi.middleware,
      webSocketMiddleware,
    ),
});

export const persistor = persistStore(store);
export default store;
