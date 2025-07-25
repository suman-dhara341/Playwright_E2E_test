import { Avatar } from "@mui/material";

const EmployeeActivityOverviewShimmer = () => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-gray-100 animate-pulse h-20 rounded-md flex items-center gap-2 p-2"
        >
          <Avatar />
          <div className="w-full flex flex-col gap-1">
            <p className="bg-gray-300 h-8 rounded-md"></p>
            <p className="bg-gray-200 h-2 w-6 rounded-xl"></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeActivityOverviewShimmer;
