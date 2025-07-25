const EmployeePulseOverviewShimmer = () => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mb-4"></div>
      <div className="grid grid-cols-2 gap-8 ">
        {[1, 2].map((_, monthIdx) => (
          <div key={monthIdx}>
            <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-2 ml-[29%]"></div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePulseOverviewShimmer;
