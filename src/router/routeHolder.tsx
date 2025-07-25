import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import DetectOffline from "../modules/global/components/Offline";
import GlobalCss from "../modules/global/css";
import { Hourglass } from "react-loader-spinner";
import { useSelector } from "react-redux";

import EmployeeGoalDetails from "../modules/goals/components/EmployeeGoalDetails";
import Growth from "../modules/growth/components";
import EmployeeGrowthConversationDetails from "../modules/growth/components/EmployeeGrowthConversationDetails";
import Hierarchy from "../modules/hierarchy/components";
import WazoAppComingSoon from "../modules/global/components/WazoAppComingSoon";
import SignUp from "../modules/authentication/components/SignUp";
import { EnvConfig } from "../config/config";
import "bootstrap/dist/css/bootstrap.min.css";
import { useGetOrganizationDetailsQuery } from "../modules/global/queries/globalQuery";
import { jwtDecode } from "jwt-decode";
import AwardMarketDetails from "../modules/award/components/AwardMarketDetails";
const SignIn = lazy(
  () => import("../modules/authentication/components/SignIn")
);
const Feed = lazy(() => import("../modules/feeds/components"));
const Profile = lazy(() => import("../modules/profile/components"));
const Badge = lazy(() => import("../modules/badge/components"));
const Award = lazy(() => import("../modules/award/components"));
const Layout = lazy(() => import("../modules/global/components/Layout"));
const AwardDescription = lazy(
  () => import("../modules/award/components/AwardDescription")
);
const AllAward = lazy(() => import("../modules/award/components/AllAward"));
const BadgeDescription = lazy(
  () => import("../modules/badge/components/BadgeDescription")
);
const AllBadge = lazy(() => import("../modules/badge/components/AllBadge"));
const EmployeeProfileWall = lazy(
  () => import("../modules/profile/components/EmployeeProfileOverview")
);
const NotFoundPage = lazy(
  () => import("../modules/global/components/NotFoundPage")
);
const AllRecognition = lazy(
  () => import("../modules/feeds/components/AllRecognition")
);
const AllFeed = lazy(() => import("../modules/feeds/components/AllFeed"));
const MyRecognition = lazy(
  () => import("../modules/feeds/components/MyRecognition")
);
const VerifyOTP = lazy(
  () => import("../modules/authentication/components/VerifyOTP")
);
const ForgotPassword = lazy(
  () => import("../modules/authentication/components/ForgotPassword")
);
const NewPassword = lazy(
  () => import("../modules/authentication/components/SetNewPassword")
);
// const WebSocketNotification = lazy(
//   () => import("../modules/global/components/Notification")
// );
const TempPasswordChange = lazy(
  () => import("../modules/authentication/components/TempPasswordChange")
);
const AnonymousFeedback = lazy(
  () => import("../modules/global/components/AnonymousFeedback")
);
const SeparateFeed = lazy(
  () => import("../modules/feeds/components/SeparateFeed")
);
const Goals = lazy(() => import("../modules/goals/components"));
const GlobalToastContainer = lazy(
  () => import("../utilities/GlobalToastContainer")
);
const ManagerHub = lazy(() => import("../modules/managerHub/components"));
const AwardMarket = lazy(
  () => import("../modules/award/components/AwardMarketplace")
);

interface AllRoutesProps {
  isAdmin: boolean;
}

const AllRoutes: React.FC<AllRoutesProps> = ({ isAdmin }) => {
  const locate = useLocation();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-[#f0f0f0]">
          <Hourglass
            visible={true}
            height="30"
            width="30"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={["#306cce", "#72a1ed"]}
          />
        </div>
      }
    >
      <Routes location={locate} key={locate.key}>
        {isAdmin ? (
          <>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/" element={<Layout />}>
              <Route path="feed" element={<Feed />}>
                <Route index element={<AllFeed />} />
                <Route path="recognition" element={<AllRecognition />} />
                <Route path="my-recognition" element={<MyRecognition />} />
                <Route path="feed-link/:id" element={<SeparateFeed />} />
              </Route>
              <Route path="awards" element={<Award />}>
                <Route index element={<AllAward />} />
                <Route path="all-awards" element={<AllAward />} />
                <Route path="award-vault" element={<AwardMarket />} />
              </Route>
              <Route path="awards/:awardId" element={<AwardDescription />} />
              <Route
                path="awards-vault/:awardId"
                element={<AwardMarketDetails />}
              />
              <Route path="badges" element={<Badge />}>
                <Route index element={<AllBadge />} />
                <Route path="all-badges" element={<AllBadge />} />
              </Route>
              <Route path="description" element={<BadgeDescription />} />
              <Route path="managerHub" element={<ManagerHub />} />
              <Route path="goals" element={<Goals />} />
              <Route
                path="goal-details/:id"
                element={<EmployeeGoalDetails />}
              />
              <Route path="growth" element={<Growth />} />
              <Route
                path="growth-details/:id"
                element={<EmployeeGrowthConversationDetails />}
              />
              <Route path="profile" element={<Profile />}>
                <Route index element={<EmployeeProfileWall />} />
              </Route>
              <Route path="profile/:id" element={<Profile />}>
                <Route index element={<EmployeeProfileWall />} />
              </Route>
              <Route path="hierarchy" element={<Hierarchy />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="*" element={<SignIn />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="verify" element={<VerifyOTP />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="set-new-password" element={<NewPassword />} />
            <Route
              path="change-temporary-password"
              element={<TempPasswordChange />}
            />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

const RouteHolder = () => {
  const authData = useSelector((state: any) => state.auth);
  const [isAuthChecked, setAuthChecked] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState();
  const [showAnonymousFeedback, setShowAnonymousFeedback] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1023);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1023);
  const isAdmin = authData.isAuthenticated;
  const idToken = useSelector((state: any) => state.auth?.idToken || "");
  const refreshToken = useSelector(
    (state: any) => state.auth?.refreshToken || ""
  );
  const userData = useSelector((state: any) => state.auth?.userData || "");

  let orgId;

  if (idToken) {
    try {
      const decoded: any = jwtDecode(idToken);
      orgId = decoded["custom:orgId"];
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const { data: organizationDetails } = useGetOrganizationDetailsQuery(orgId, {
    skip: !orgId,
  });

  useEffect(() => {
    setOnboardingStatus(organizationDetails?.data?.isConfigured);
  }, [organizationDetails]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1023);
      setIsDesktop(window.innerWidth >= 1023);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (authData) setAuthChecked(true);
  }, [authData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnonymousFeedback(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleAdminRedirect = () => {
      const base64Encode = (value: string) =>
        btoa(unescape(encodeURIComponent(value)));
      const encodedIdToken = base64Encode(idToken);
      const encodedRefreshToken = base64Encode(refreshToken);
      const encodedUserData = base64Encode(JSON.stringify(userData));
      const adminUrlWithParams = `${EnvConfig.adminUrl}?a=${encodedIdToken}&b=${encodedRefreshToken}&c=${encodedUserData}`;
      window.location.href = adminUrlWithParams;
    };

    if (isAuthChecked && isAdmin && onboardingStatus === false) {
      handleAdminRedirect();
    }
  }, [
    isAuthChecked,
    isAdmin,
    onboardingStatus,
    idToken,
    refreshToken,
    userData,
  ]);

  if (!isAuthChecked) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#f0f0f0]">
        <Hourglass
          visible={true}
          height="20"
          width="20"
          ariaLabel="hourglass-loading"
          colors={["#306cce", "#72a1ed"]}
        />
      </div>
    );
  }

  return (
    <>
      <GlobalCss />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen bg-[#f0f0f0]">
            <Hourglass
              visible={true}
              height="20"
              width="20"
              ariaLabel="hourglass-loading"
              colors={["#306cce", "#72a1ed"]}
            />
          </div>
        }
      >
        <div>
          <DetectOffline showOverlay={false} showToast />
          <GlobalToastContainer />
          {/* <WebSocketNotification /> */}
          {isAdmin && showAnonymousFeedback && <AnonymousFeedback />}
          <Router>
            {isMobile ? (
              <WazoAppComingSoon />
            ) : isDesktop ? (
              <AllRoutes isAdmin={isAdmin} />
            ) : null}
          </Router>
        </div>
      </Suspense>
    </>
  );
};

export default RouteHolder;
