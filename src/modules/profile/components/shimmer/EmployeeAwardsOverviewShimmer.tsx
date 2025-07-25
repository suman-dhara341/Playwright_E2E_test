const EmployeeAwardsOverviewShimmer = () => {
  return (
    <div
      className="bg-white rounded-md p-3 animate-pulse mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="flex items-center justify-between p-2 border-b border-gray-300">
        <p className="bg-gray-100 h-5 w-12 rounded-xl"></p>
        <p className="bg-gray-100 h-5 w-16 rounded-xl"></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 my-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className={`h-36 w-full rounded-md ${
              item % 2 === 0 ? "bg-gray-200" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeAwardsOverviewShimmer