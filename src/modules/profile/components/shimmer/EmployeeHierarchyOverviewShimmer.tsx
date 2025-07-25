import { Avatar } from "@mui/material";

const EmployeeHierarchyOverviewShimmer = () => {
  return (
    <div
      className="bg-white rounded-md animate-pulse"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between w-full p-3 border-b border-gray-200">
        <p className="bg-gray-200 rounded-full h-5 w-16"></p>
        <p className="bg-gray-200 rounded-full h-5 w-14"></p>
      </div>
      <div className="flex items-center gap-2 py-2 px-4">
        <Avatar sx={{ height: 55, width: 55 }} />
        <div className="flex flex-col gap-1">
          <p className="bg-gray-200 rounded-full h-4 w-20"></p>
          <p className="bg-gray-100 rounded-full h-4 w-14"></p>
        </div>
      </div>
      <div className="flex items-center gap-2 py-2 px-14">
        <Avatar sx={{ height: 55, width: 55 }} />
        <div className="flex flex-col gap-1">
          <p className="bg-gray-200 rounded-full h-4 w-36"></p>
          <p className="bg-gray-100 rounded-full h-4 w-20"></p>
        </div>
      </div>
      <div className="flex items-center gap-2 py-2 px-14">
        <Avatar sx={{ height: 55, width: 55 }} />
        <div className="flex flex-col gap-1">
          <p className="bg-gray-200 rounded-full h-4 w-40"></p>
          <p className="bg-gray-100 rounded-full h-4 w-24"></p>
        </div>
      </div>
      <div className="flex items-center gap-2 py-2 px-14">
        <Avatar sx={{ height: 55, width: 55 }} />
        <div className="flex flex-col gap-1">
          <p className="bg-gray-200 rounded-full h-4 w-56"></p>
          <p className="bg-gray-100 rounded-full h-4 w-20"></p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHierarchyOverviewShimmer;
