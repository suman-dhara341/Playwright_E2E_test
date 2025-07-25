import { useGetMyAwardsQuery } from "../../award/queries/awardQuery";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyBadgesQuery } from "../../badge/queries/badgeQuery";
import {
  useGetMyRecognitionQuery,
  useGetProfileDetailsQuery,
} from "../../profile/queries/profileQuery";
import EmployeeName from "../../../common/EmployeeName";
import { useEffect, useState } from "react";
import { setReportsTo } from "../slice/feedProfileSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { setAvatarImageUrl } from "../slice/avatarSlice";
import Avatar from "../../../common/Avatar";
import { Mail, Phone } from "lucide-react";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../../profile/slice/tabSlice";

const ProfileCard = ({ profile }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recognitionType = "received-by";
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const reportsTo = useSelector((state: any) => state.feedProfile.reportsTo);
  const [nextToken] = useState<string | null>(null);
  const {
    data: myAwardData,
    isLoading: awardsLoading,
    isError: awardsError,
  } = useGetMyAwardsQuery({ ORG_ID, EMP_ID, nextToken });
  const {
    data: myBadges,
    isLoading: badgesLoading,
    isError: badgesError,
  } = useGetMyBadgesQuery({ ORG_ID, EMP_ID });
  const {
    data: profileRecognition,
    isLoading: recognitionsLoading,
    isError: recognitionsError,
  } = useGetMyRecognitionQuery({
    recognitionType,
    EMP_ID,
    ORG_ID,
    nextToken,
  });
  useEffect(() => {
    if (profile?.data?.reportsTo) {
      dispatch(setReportsTo(profile.data.reportsTo));
    }
    if (profile?.data?.photo) {
      dispatch(setAvatarImageUrl(profile?.data?.photo));
    }
  }, [profile, dispatch]);

  const { data: profileDetails } = useGetProfileDetailsQuery(
    reportsTo.length > 4 ? { ORG_ID, reportsTo } : skipToken
  );

  const truncateText = (text: string = "", length: number): string => {
    if (text.length <= length) {
      return text;
    }
    return `${text.slice(0, length)}...`;
  };

  const imageUrl = profile?.data?.photo || "";
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  const groupedRecognitions = profileRecognition?.data?.length
    ? profileRecognition.data.reduce((acc, recognition) => {
        const employeeId = recognition?.recognitionGivenBy?.employeeId;
        if (!employeeId) return acc;

        if (!acc[employeeId]) {
          acc[employeeId] = { ...recognition, count: 1 };
        } else {
          acc[employeeId].count += 1;
        }

        return acc;
      }, {} as Record<string, (typeof profileRecognition.data)[number] & { count: number }>)
    : {};

  const uniqueRecognitions = Object.values(groupedRecognitions || {}).slice(
    0,
    4
  );

  const getPathFromMenu = (menu: string): string => {
    const validTabs = ["spotlight", "recognition", "awards", "badges"];
    if (validTabs.includes(menu)) {
      return `/profile?tab=${menu}`;
    }
    return `/profile?tab=spotlight`;
  };

  const useRedirectToProfileTab = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (menuName: string) => {
      const allowedTabs = ["recognition", "awards", "badges"];
      const tabToSet = allowedTabs.includes(menuName) ? menuName : "spotlight";

      dispatch(setActiveTab(tabToSet));
      const path = getPathFromMenu(tabToSet);
      navigate(path);
    };
  };
  const redirectToProfileTab = useRedirectToProfileTab();

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div
        className="bg-white rounded-md p-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="flex justify-center mb-2">
          <Avatar
            image={imageWithTimestamp}
            name={profile?.data?.firstName}
            size={75}
          />
        </div>
        <div className="text-center">
          <EmployeeName
            firstName={profile?.data?.firstName}
            middleName={profile?.data?.middleName}
            lastName={profile?.data?.lastName}
            empId={profile?.data?.employeeId}
            textColor={"!text-[#585DF9]"}
            fontWeight={"font-semibold"}
            textVarient={"!text-2xl"}
          />
          <p className="my-2 text-sm">
            {truncateText(profile?.data?.shortDescription, 60)}
          </p>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex gap-2">
            <Mail className="w-5 h-5" />
            <p className="font-semibold">{profile?.data?.primaryEmail}</p>
          </div>
          {profile?.data?.primaryPhone ? (
            <div className="flex gap-2">
              <Phone className="w-5 h-5" />
              <p className="font-semibold">{profile?.data?.primaryPhone}</p>
            </div>
          ) : null}
        </div>
        <div className="flex w-full items-start flex-column mt-3">
          <p className="text-sm font-semibold !text-[#73737D]">Awards</p>
          <div id="awards" className="mt-2 my-3">
            {awardsLoading ? (
              <ThreeDotsLoading color={"#585DF9"} />
            ) : awardsError ? (
              <p className="text-sm text-red-500">
                Unable to fetch awards. Please try again later.
              </p>
            ) : myAwardData?.data?.length ? (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => redirectToProfileTab("awards")}
              >
                <div className="flex gap-1">
                  {myAwardData.data.slice(0, 4).map((data) => (
                    <img
                      key={data?.awardDetails?.awardId}
                      src={data?.awardDetails?.awardPhoto}
                      alt={data?.awardDetails?.awardName}
                      className="w-8 h-8 border-2 border-white"
                    />
                  ))}
                </div>
                {myAwardData?.data?.length - 4 > 0 && (
                  <span className="text-xs text-[#585DF9]">
                    +{myAwardData?.data?.length - 4} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#73737D]">No awards</p>
            )}
          </div>

          <p className="text-sm font-semibold !text-[#73737D]">Badges</p>
          <div className="mt-2 my-3">
            {badgesLoading ? (
              <ThreeDotsLoading color={"#585DF9"} />
            ) : badgesError ? (
              <p className="text-sm text-red-500">
                Unable to fetch badges. Please try again later.
              </p>
            ) : myBadges?.data?.length ? (
              <div
                id="badges"
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => redirectToProfileTab("badges")}
              >
                <div className="flex gap-1">
                  {myBadges.data.slice(0, 4).map((data) => {
                    return (
                      <img
                        key={`${data.name}_${data.awardedAt}_${data.category}`}
                        src={data?.badgePhoto}
                        alt={data?.name}
                        className="w-8 h-8 border-2 border-white"
                      />
                    );
                  })}
                </div>
                {myBadges?.data?.length - 4 > 0 && (
                  <span
                    className="text-xs text-[#585DF9]"
                    onClick={() => {
                      const path = getPathFromMenu("badges");
                      navigate(path);
                    }}
                  >
                    +{myBadges?.data?.length - 4} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#73737D]">No badges</p>
            )}
          </div>

          <p className="text-sm font-semibold !text-[#73737D]">Recognition</p>
          <div className="mt-2 my-3">
            {recognitionsLoading ? (
              <ThreeDotsLoading color={"#585DF9"} />
            ) : recognitionsError ? (
              <p className="text-sm text-red-500">
                Unable to fetch recognition. Please try again later.
              </p>
            ) : profileRecognition?.data?.length ? (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={() => redirectToProfileTab("recognition")}
              >
                <div className="flex relative gap-1">
                  {uniqueRecognitions.map((data) => (
                    <div key={data.recognitionGivenBy?.employeeId}>
                      {data.count > 1 ? (
                        <div className="flex justify-center items-center absolute bg-[#585DF9] text-white w-[12px] h-[12px] text-[9px] rounded-md bottom-0">
                          {data.count}
                        </div>
                      ) : null}

                      <Avatar
                        image={data.recognitionGivenBy?.photo}
                        name={data?.recognitionGivenBy?.firstName}
                        size={30}
                      />
                    </div>
                  ))}
                </div>
                {profileRecognition?.data?.length - 4 > 0 && (
                  <span className="text-xs text-[#585DF9]">
                    +{profileRecognition?.data?.length - 4} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#73737D]">No recognition</p>
            )}
          </div>
        </div>
        {profile?.data?.reportsTo !== "Root" ? (
          <div className="flex justify-between items-center">
            <p>Reports To</p>
            <div id="reportsTo" >
              <EmployeeName
                firstName={profileDetails?.data?.firstName}
                middleName={profileDetails?.data?.middleName}
                lastName={profileDetails?.data?.lastName}
                empId={profileDetails?.data?.employeeId}
                textColor="!text-[#3F4354]"
                fontWeight="font-semibold"
                textVarient="!text-base"
              />
            </div>
          </div>
        ) : null}
      </div>
    </ErrorBoundary>
  );
};

export default ProfileCard;
