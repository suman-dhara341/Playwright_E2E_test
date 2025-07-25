const ManagerHubGoalsShimmer = () => {
  return (
    <div
      className="mt-3 h-[calc(100vh-215px)]  bg-white rounded-md"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div
        className="overflow-y-auto w-full h-full animate-pulse"
        id="myTeamGoals"
      >
        <table className="w-full text-sm text-left text-[#3F4354]">
          <thead className="text-[#3F4354] border-b border-[#E8E8EC] uppercase text-xs font-medium">
            <tr>
              <th className="w-[35%] p-3">Title</th>
              <th className="w-[15%] p-3">Due Month</th>
              <th className="w-[15%] p-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b border-[#E8E8EC]">
                <td className="w-[35%] px-3 py-4">
                  <div className="flex gap-2 items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </td>
                <td className="w-[15%] px-3 py-4">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </td>
                <td className="w-[15%] px-3 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1"></div>
                  <div className="h-3 w-8 bg-gray-200 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerHubGoalsShimmer;
