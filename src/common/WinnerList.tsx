import EmployeeName from "./EmployeeName";
import Avatar from "./Avatar";
import Loading from "../utilities/Loading";
import Error from "../utilities/Error";

const WinnerList = ({ winners, isLoading, isError }: any) => {
  const useTimeAgo = (date: string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "-";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-2 h-[calc(100vh-330px)] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-2 h-[calc(100vh-330px)] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  if (!winners || winners.length === 0) {
    return (
      <div className="flex justify-center items-center mt-2 h-[calc(100vh-330px)] p-3 bg-white rounded-md text-[#73737D]">
        No winners found
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[calc(100vh-330px)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#585DF9]/50 scrollbar-track-gray-100 px-3">
      {winners.map((winner: any) => (
        <div
          key={winner.awardedAt}
          className="flex items-end justify-between pb-1 mb-3"
        >
          <div className="flex items-center gap-3">
            <Avatar
              name={winner?.employeeDetails?.firstName}
              image={winner.employeeDetails?.photo || ""}
              size={40}
            />
            <div>
              <EmployeeName
                firstName={winner?.employeeDetails?.firstName}
                middleName={winner?.employeeDetails?.middleName}
                lastName={winner?.employeeDetails?.lastName}
                empId={winner?.employeeDetails?.employeeId}
                textColor={"!text-[#585DF9]"}
                fontWeight={"font-semibold"}
                textVarient={"!text-sm"}
              />
              <p className="text-[#73737D] !font-normal !text-[#878791]">
                {winner?.employeeDetails?.designation?.designationName}
              </p>
            </div>
          </div>
          <span className="text-[#73737D] !font-normal !text-[#878791]">
            {useTimeAgo(winner?.awardedAt)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WinnerList;
