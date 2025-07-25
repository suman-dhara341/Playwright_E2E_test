const EmployeeJourneyShimmer = () => {
  return (
    <div
      className="min-h-[calc(100vh-360px)] bg-white rounded-md mb-3 border border-[#E8E8EC] p-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8E8EC] pb-3 mb-4">
        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="space-y-8 px-4">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="relative flex gap-4">
            <div className="w-full space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-1 sm:mb-0"></div>
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="h-5 w-16 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeJourneyShimmer;
