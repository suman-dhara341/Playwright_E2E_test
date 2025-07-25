const EmployeeJourneyOverviewShimmer = () => {
  return (
    <div
      className="bg-white rounded-md animate-pulse mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        <p className="bg-gray-100 h-6 w-16 rounded-xl"></p>
        <p className="bg-gray-100 h-6 w-14 rounded-xl"></p>
      </div>
      {[1, 2, 3].map((item) => (
        <div key={item} className="mt-2 px-3 py-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <p className="bg-gray-200 h-6 w-20 rounded-full"></p>
            <p className="bg-gray-200 h-5 w-24 rounded-full"></p>
          </div>
          <div className="flex items-center gap-2 my-2">
            <p className="bg-gray-100 h-4 w-12 rounded-full"></p>
            <p className="bg-gray-100 h-4 w-20 rounded-full"></p>
          </div>
          <div className="flex items-center gap-1">
            <p className="h-4 w-4 rounded-full bg-gray-200"></p>
            <p className="h-4 w-20 bg-gray-200 rounded-full"></p>
          </div>
          <div className="flex items-center gap-2">
            <p className="mt-2 bg-gray-100 w-16 h-4 rounded-full"></p>
            <p className="mt-2 bg-gray-100 w-16 h-4 rounded-full"></p>
            <p className="mt-2 bg-gray-100 w-16 h-4 rounded-full"></p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeJourneyOverviewShimmer;
