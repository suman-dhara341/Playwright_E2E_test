const EmployeeInsightOverviewShimmer = () => {
  return (
    <div
      className="bg-white rounded-md animate-pulse mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="bg-gray-200 h-6 w-24 rounded-xl"></p>
        <div className="flex items-center gap-2">
          <p className="bg-gray-200 h-7 w-28 rounded-xl"></p>
          <p className="bg-gray-200 h-6 w-14 rounded-xl"></p>
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 flex items-end gap-2">
        <p className="bg-gray-200 h-44 w-20"></p>
        <p className="bg-gray-200 h-60 w-20"></p>
        <p className="bg-gray-200 h-80 w-20"></p>
        <p className="bg-gray-200 h-32 w-20"></p>
        <p className="bg-gray-200 h-52 w-20"></p>
        <p className="bg-gray-200 h-40 w-20"></p>
      </div>
    </div>
  );
};

export default EmployeeInsightOverviewShimmer;
