import { useSelector } from "react-redux";
import { useGetGoalsPendingApprovalListQuery } from "../queries/okrQuery";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";

const EmployeeRequestedGoals = () => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const {
    data: goalsPendingApprovalListData,
    isError: goalsPendingApprovalListIsError,
    isLoading: goalsPendingApprovalListIsLoading,
  } = useGetGoalsPendingApprovalListQuery({ EMP_ID, ORG_ID });

  console.log(goalsPendingApprovalListData,"goalsPendingApprovalListData")

  if (goalsPendingApprovalListIsLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (goalsPendingApprovalListIsError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }
  return <div>EmployeeRequestedGoals</div>;
};

export default EmployeeRequestedGoals;
