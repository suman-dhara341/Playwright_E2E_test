import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Feed from "../../feeds/components";
import EmployeeEditGlobal from "./EmployeeEditGlobal";
import { closeModal } from "../slice/modalSlice";
import {
  useGetProfileDetailsQuery,
  useGetProfileQuery,
} from "../../profile/queries/profileQuery";
import { setAvatarImageUrl } from "../../feeds/slice/avatarSlice";
import Drawer from "../../../common/Drawer";
import OnboadingForm from "./OnboadingForm";
import { Hourglass } from "react-loader-spinner";

const Layout = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const isModalOpen = useSelector((state: any) => state.modal.isModalOpen);
  const reportsTo = useSelector((state: any) => state.feedProfile.reportsTo);
  const onboardingStateManual = useSelector((state: any) => state.onboarding.status);

  const {
    data: profile,
    isLoading: profileIsLoading,
    isError: profileIsError,
    refetch: profileRefetch,
  } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const onboardingState = profile?.data?.onboardingStatus || onboardingStateManual;


  const shouldFetchProfileDetails = reportsTo.length > 4;

  const { data: profileDetails } = useGetProfileDetailsQuery(
    { ORG_ID, reportsTo },
    { skip: !shouldFetchProfileDetails }
  );

  useEffect(() => {
    if (profile?.data?.photo) {
      dispatch(setAvatarImageUrl(profile.data.photo));
    }
  }, [profile, dispatch]);
  

  if (profileIsLoading) {
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

  const handleCloseModal = () => dispatch(closeModal());

  return (
    <div>
      <Navbar profileData={profile}/>
      {onboardingState ? (
        <>
          <Drawer
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            heading="Update Employee details"
          >
            <EmployeeEditGlobal
              profile={profile}
              ORG_ID={ORG_ID}
              EMP_ID={EMP_ID}
              profileDetails={profileDetails}
              profileRefetch={profileRefetch}
            />
          </Drawer>

          <div className="px-2 mt-[75px] max-w-[1170px] mx-auto">
            {pathname === "/" && <Feed />}
            <Outlet />
          </div>
        </>
      ) : (
        <OnboadingForm profile={profile} profileIsLoading={profileIsLoading} profileIsError={profileIsError} profileRefetch={profileRefetch}/>
      )}
    </div>
  );
};

export default Layout;
