import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../common/Avatar";
import EmployeeName from "../../../common/EmployeeName";
import { useGetMyAwardsQuery } from "../../award/queries/awardQuery";
import { useGetMyBadgesQuery } from "../../badge/queries/badgeQuery";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { useState } from "react";
import { useGetMyRecognitionQuery } from "../../profile/queries/profileQuery";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../../profile/slice/tabSlice";

const SelectedEmployeeProfile = ({ selectedEmployee }: any) => {
  const navigate = useNavigate();
  const [nextToken] = useState<string | null>(null);
  const recognitionType = "received-by";
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = selectedEmployee?.employeeId;
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
    data: recognitionData,
    isLoading: recognitionDataIsLoading,
    isError: recognitionDataIsError,
  } = useGetMyRecognitionQuery(
    {
      recognitionType,
      EMP_ID,
      ORG_ID,
      nextToken,
    }
  );

  const groupedRecognitions = recognitionData?.data?.length
    ? recognitionData.data.reduce((acc, recognition) => {
        const employeeId = recognition?.recognitionGivenBy?.employeeId;
        if (!employeeId) return acc;

        if (!acc[employeeId]) {
          acc[employeeId] = { ...recognition, count: 1 };
        } else {
          acc[employeeId].count += 1;
        }

        return acc;
      }, {} as Record<string, (typeof recognitionData.data)[number] & { count: number }>)
    : {};

  const uniqueRecognitions = Object.values(groupedRecognitions || {}).slice(
    0,
    4
  );

  const calculateTenure = (joiningDate: string) => {
    if (!joiningDate) return "-";

    const joinDate = new Date(joiningDate);
    const currentDate = new Date();

    let yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
    let monthsDiff = currentDate.getMonth() - joinDate.getMonth();

    if (currentDate.getDate() < joinDate.getDate()) {
      monthsDiff -= 1;
    }

    if (monthsDiff < 0) {
      yearsDiff -= 1;
      monthsDiff += 12;
    }

    if (yearsDiff < 0 || (yearsDiff === 0 && monthsDiff <= 0)) {
      return "< 1m";
    }

    const yearPart = yearsDiff > 0 ? `${yearsDiff}y` : "";
    const monthPart = monthsDiff > 0 ? `${monthsDiff}m` : "";

    return [yearPart, monthPart].filter(Boolean).join(" ");
  };

  const tenure = selectedEmployee?.joiningDate
    ? calculateTenure(selectedEmployee.joiningDate)
    : "-";

  const handleRedirect = (path: string) => {
    if (!path) return;
    navigate(path);
  };

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
    <div className="max-w-sm mx-auto bg-white rounded-xl px-3 py-6 flex flex-col items-center space-y-4">
      <Avatar
        image={selectedEmployee?.photo}
        name={selectedEmployee?.firstName}
        size={75}
        className="mb-2"
      />

      <div className="text-center mb-1">
        <EmployeeName
          firstName={selectedEmployee?.firstName}
          middleName={selectedEmployee?.middleName}
          lastName={selectedEmployee?.lastName}
          empId={selectedEmployee?.employeeId}
          textColor={"!text-[#585DF9]"}
          fontWeight={"font-semibold"}
          textVarient={"!text-base"}
        />
        <p className="text-sm text-[#73737D]">
          {selectedEmployee?.designation} • Joined{" "}
          {selectedEmployee?.joiningDate}
        </p>
        <p className="text-sm text-[#73737D] mt-1">
          {selectedEmployee?.joiningDate} -{" "}
          {selectedEmployee?.active ? "Present" : selectedEmployee?.endDate} (
          {tenure})
        </p>
      </div>
      {(selectedEmployee.grade ||
        selectedEmployee.department ||
        selectedEmployee.location) && (
        <div className="flex items-center gap-1">
          {selectedEmployee.grade && (
            <div className="flex gap-1 items-center text-xs">
              <span className="text-[#73737D] rounded text-xs">Grade:</span>
              <span className="ml-1 text-[#3F4354] font-semibold">
                {selectedEmployee.grade}
              </span>
            </div>
          )}
          {selectedEmployee.grade &&
            (selectedEmployee.department || selectedEmployee.location) && (
              <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
            )}
          {selectedEmployee.department && (
            <div className="flex gap-1 items-center text-xs">
              <span className="text-[#73737D] rounded text-xs">
                Department:
              </span>
              <span className="ml-1 text-[#3F4354] font-semibold">
                {selectedEmployee.department}
              </span>
            </div>
          )}
          {selectedEmployee.department && selectedEmployee.location && (
            <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
          )}
          {selectedEmployee.location && (
            <div className="flex gap-1 items-center text-xs">
              <span className="text-[#73737D] rounded text-xs">Location:</span>
              <span className="ml-1 text-[#3F4354] font-semibold">
                {selectedEmployee.location}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex w-full items-start flex-column m-0">
        <p className="text-sm font-semibold !text-[#73737D]">Awards</p>
        <div className="mt-2 my-3">
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
                <span className="text-xs text-[#585DF9]">
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
          {recognitionDataIsLoading ? (
            <ThreeDotsLoading color={"#585DF9"} />
          ) : recognitionDataIsError ? (
            <p className="text-sm text-red-500">
              Unable to fetch recognition. Please try again later.
            </p>
          ) : recognitionData?.data?.length ? (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => redirectToProfileTab("recognition")}
            >
              <div className="flex gap-1 relative">
                {uniqueRecognitions.map((data) => (
                  <div key={data.recognitionGivenBy?.employeeId}>
                    {data.count > 1 ? (
                      <div className="absolute bg-[#585DF9] text-white w-[12px] h-[12px] text-[9px] rounded-md bottom-0">
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
              {recognitionData?.data?.length - 4 > 0 && (
                <span className="text-xs text-[#585DF9]">
                  +{recognitionData?.data?.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#73737D]">No recognition</p>
          )}
        </div>
      </div>

      {/* View Profile Button */}
      <button
        className="w-full bg-[#585DF921] text-[#585DF9] py-2 font-semibold rounded mt-3"
        onClick={() =>
          handleRedirect(`/profile/${selectedEmployee?.employeeId}`)
        }
      >
        View Full Profile
      </button>
    </div>
  );
};

export default SelectedEmployeeProfile;
