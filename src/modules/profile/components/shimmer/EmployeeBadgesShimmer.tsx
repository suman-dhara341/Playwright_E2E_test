const EmployeeBadgesShimmer = () => {
  return (
    <div
      className="p-3 mb-3 bg-white rounded-md"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>

      <div className="flex flex-wrap gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 7, 8].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeBadgesShimmer;
