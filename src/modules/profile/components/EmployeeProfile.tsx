import { Phone, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProfileDetailsQuery,
  useGetProfileQuery,
} from "../queries/profileQuery";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { setReportsTo } from "../../feeds/slice/feedProfileSlice";
import { useEffect } from "react";
import Avatar from "../../../common/Avatar";
import EmployeeName from "../../../common/EmployeeName";
import { useParams } from "react-router-dom";
import { BsFilePerson } from "react-icons/bs";
import EmployeeActivityOverview from "./EmployeeActivityOverview";
import { setActiveTab } from "../slice/tabSlice";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";

const EmployeeProfile = () => {
  const dispatch = useDispatch();
  const paramsData = useParams();
  const empId: any = paramsData.id;

  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = empId
    ? empId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const handleTabClick = (value: string) => {
    dispatch(setActiveTab(value));
  };
  const {
    data: profile,
    isError: profileIsError,
    isLoading: profileIsLoading,
  } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const reportsTo = useSelector((state: any) => state.feedProfile.reportsTo);

  useEffect(() => {
    if (profile?.data?.reportsTo) {
      dispatch(setReportsTo(profile.data.reportsTo));
    }
  }, [profile, dispatch]);

  const shouldFetchProfileDetails = reportsTo.length > 4;
  const { data: profileDetails } = useGetProfileDetailsQuery(
    { ORG_ID, reportsTo },
    {
      skip: !shouldFetchProfileDetails,
    }
  );

  const imageUrl = profile?.data?.photo || "";
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  const parseDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const useTimeAgo = profile?.data?.joiningDate
    ? new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(parseDate(profile.data.joiningDate))
    : "-";

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

  const tenure = profile?.data?.joiningDate
    ? calculateTenure(profile.data.joiningDate)
    : "-";

  if (profileIsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] p-3 mb-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (profileIsError) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] p-3 mb-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row border-b-1 border-[#E8E8EC]">
      <div className="flex-1 bg-white p-[20px] border-r-1 border-[#E8E8EC] rounded-md">
        <div className="flex items-start gap-2">
          <div className="w-auto">
            <Avatar
              name={profile?.data?.firstName || ""}
              image={imageWithTimestamp}
              size={100}
            />
          </div>
          <div className="w-full">
            <div className="w-full flex justify-content-between items-center">
              <div className="w-[75%]">
                <h4
                  id="profile_name"
                  className="text-[20px] !font-semibold !text-[#585DF9] m-0"
                >
                  {`${profile?.data?.firstName} ${
                    profile?.data?.middleName
                      ? profile.data.middleName + " "
                      : ""
                  } ${profile?.data?.lastName}`}
                </h4>
                {useTimeAgo && (
                  <div className="w-full flex items-center flex-wrap gap-1">
                    <p className="text-[#73737D] text-sm">
                      {profile?.data?.designation?.designationName}
                    </p>
                    <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                    <p className="text-[#73737D] text-sm">
                      Joined {useTimeAgo}
                    </p>
                    {tenure && (
                      <>
                        <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
                        <p className="flex gap-1 items-center text-sm">
                          <span className="text-[#73737D] text-sm">
                            Tenure:
                          </span>
                          <span className="ml-1 text-[#73737D] text-sm">
                            {tenure}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
              {profileDetails?.data?.reportsTo &&
                profile?.data?.reportsTo !== "Root" && (
                  <div className="w-[25%] flex items-center justify-end gap-1">
                    <span className="text-[#585DF9] text-sm font-semibold">
                      <BsFilePerson className="text-[#585DF9]" />
                    </span>{" "}
                    <EmployeeName
                      firstName={profileDetails?.data?.firstName}
                      middleName={profileDetails?.data?.middleName}
                      lastName={profileDetails?.data?.lastName}
                      empId={profileDetails?.data?.employeeId}
                      textVarient="text-sm"
                      textColor="text-[#3F4354]"
                      fontWeight="font-semibold"
                    />
                  </div>
                )}
            </div>
            <div>
              {profile?.data?.shortDescription && (
                <div className="mb-3 mt-2">
                  <h5 className="!text-lg !text-[#3F4354] !font-semibold mb-0">
                    About
                  </h5>
                  <p>{profile?.data?.shortDescription}</p>
                </div>
              )}
              <div className="flex gap-4 mt-3">
                {profile?.data?.primaryPhone ? (
                  <div className="flex items-center text-[#3F4354] relative">
                    <div className="bg-[#F4F6F8] p-2 rounded-md z-[1]">
                      <Phone className="h-5 w-5 text-[#858EAD]" />
                    </div>
                    <p className="!ml-[-15px] border-2 border-[#F4F6F8] rounded-2xl py-1 pr-3 pl-6 text-[12px] font-semibold text-[#3F4354]">
                      {profile?.data?.primaryPhone}
                    </p>
                  </div>
                ) : null}
                {/* <div className="flex items-center text-[#3F4354] relative">
                  <div className="bg-[#F4F6F8] p-2 rounded-md z-[1]">
                    <MapPin className="h-5 w-5 text-[#858EAD]" />
                  </div>
                  <p className="!ml-[-15px] border-2 border-[#F4F6F8] rounded-2xl py-1 pr-3 pl-6 text-[12px] font-semibold text-[#3F4354]">
                    Ontario, Canada
                  </p>
                </div> */}
                {profile?.data?.primaryEmail ? (
                  <div className="flex items-center text-[#3F4354] relative">
                    <div className="bg-[#F4F6F8] p-2 rounded-md z-[1]">
                      <Mail className="h-5 w-5 text-[#858EAD]" />
                    </div>
                    <p className="!ml-[-15px] border-2 border-[#F4F6F8] rounded-2xl py-1 pr-3 pl-6 text-[12px] font-semibold text-[#3F4354]">
                      {profile?.data?.primaryEmail}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md">
        <div className="flex items-center justify-between p-3 border-b-1 border-[#E8E8EC]">
          <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
            Activity
          </p>
          <p
            className="text-[12px] font-[400] !text-[#585DF9] cursor-pointer"
            onClick={() => handleTabClick("activity")}
          >
            View all
          </p>
        </div>
        <ErrorBoundary fallback={<ErrorFallback height="20vh" />}>
          <div className="w-[400px]">
            <EmployeeActivityOverview />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default EmployeeProfile;
