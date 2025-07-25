const EmployeeGoalsShimmer = () => {
  return (
    <div className="w-full flex gap-3">
      <div className="w-[75%] h-[calc(100vh-140px)] mt-3 p-3 bg-white rounded-md shadow-sm">
        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-24 bg-gray-200 rounded animate-pulse"
              />
            ))}
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300 text-sm font-semibold text-[#3F4354]">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse ml-5"></div>
          </div>
          <div className="text-center h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 px-3 py-3 gap-4 border-b border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 col-span-1" />
            <div className="h-4 bg-gray-200 rounded w-2/3 col-span-1" />
            <div className="h-4 bg-gray-200 rounded w-1/2 col-span-1" />
            <div className="flex flex-col gap-1">
              <div className="w-full bg-gray-200 h-2 rounded-full" />
              <div className="h-3 w-10 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>

      <div className="w-[25%] py-3 space-y-3">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-md p-3 shadow-sm animate-pulse space-y-2 flex"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto" />
            <div className="w-full flex flex-col gap-2">
              <p className="h-4 bg-gray-200 w-3/4 mx-auto rounded" />
              <p className="h-4 bg-gray-200 w-1/2 mx-auto rounded" />
            </div>
          </div>
        ))}

        <div className="bg-white rounded-md p-3 shadow-sm animate-pulse">
          <div className="h-5 w-1/2 bg-gray-200 rounded mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <div className="w-[2px] h-12 bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeGoalsShimmer;
