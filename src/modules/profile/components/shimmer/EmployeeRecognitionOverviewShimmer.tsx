import { Avatar } from "@mui/material";

const EmployeeRecognitionOverviewShimmer = () => {
  return (
    <div
      className="bg-white rounded-md animate-pulse mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="bg-gray-200 h-6 w-24 rounded-xl"></p>
        <p className="bg-gray-200 h-6 w-14 rounded-xl"></p>
      </div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex gap-2 border-t border-gray-200 p-4 w-full"
        >
          <Avatar />
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="space-y-2 200">
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
              <div className="bg-gray-100 h-3 w-12 rounded"></div>
              <div className="bg-gray-200 h-14 w-[20rem] rounded"></div>
            </div>
            <p className="h-20 w-20 rounded-full bg-gray-100"></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeRecognitionOverviewShimmer;
