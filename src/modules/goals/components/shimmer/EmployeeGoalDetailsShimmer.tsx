import { ChevronRight } from "lucide-react";

const EmployeeGoalDetailsShimmer = () => {
  return (
    <div className="min-h-[70vh]">
      <div
        className="bg-white relative rounded-md mb-3 animate-pulse"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="w-full flex justify-between px-3 pt-6 pb-3 gap-4">
          <div className="w-[88%]">
            <div className="flex gap-1 items-center mb-2">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </div>
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-5 w-16 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          <div className="w-[12%]">
            <div className="w-24 h-24 border-8 border-gray-200  rounded-full" />
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#E8E8EC] p-3">
          <div className="flex items-center gap-2">
            <p className="h-4 w-8 bg-gray-200 rounded-2xl"></p>
            <div className="h-5 w-24 bg-gray-200 rounded" />
            <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
          </div>
          <div className="flex items-center gap-2">
            <p className="h-4 w-8 bg-gray-200 rounded-2xl"></p>
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div
        className="bg-white rounded-md animate-pulse p-4"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeGoalDetailsShimmer;
