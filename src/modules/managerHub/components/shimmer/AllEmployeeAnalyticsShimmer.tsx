const AllEmployeeAnalyticsShimmer = () => {
  return (
    <div className="w-full mb-3 animate-pulse">
      <div className="flex justify-between gap-3 mb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-[33.33%] bg-white rounded-md flex items-center gap-3 px-3 py-2"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-5 w-1/2 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div
        className="bg-white rounded-md p-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="flex flex-row gap-x-3 w-full mb-3">
          <div className="w-full">
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
          <div className="w-full">
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        </div>

        <div className="w-full h-[calc(100vh-400px)] flex items-center justify-center">
          <div className="w-full h-72 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default AllEmployeeAnalyticsShimmer;
