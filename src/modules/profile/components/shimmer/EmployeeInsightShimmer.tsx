const EmployeeInsightShimmer = () => {
  return (
    <>
      <div
        className="bg-white flex items-center justify-between p-4 animate-pulse"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <p className="bg-gray-200 h-8 w-20 rounded-full"></p>
        <div className="flex items-center gap-2">
          <p className="bg-gray-200 h-8 w-20 rounded-full"></p>
          <p className="bg-gray-200 h-8 w-32 rounded-full"></p>
          <p className="bg-gray-200 h-8 w-20 rounded-full"></p>
          <p className="bg-gray-200 h-8 w-32 rounded-full"></p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 animate-pulse">
        {[1, 2, 3, 4].map((item,index) => (
          <div
            key={index}
            className="bg-white grid grid-cols-4 gap-2 p-4"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <p
              className={`${
                item % 2 ? "bg-gray-100" : "bg-gray-200"
              } h-14 w-14 rounded-full`}
            ></p>
            <div className="flex gap-2 flex-col">
              <p
                className={`${
                  item % 2 ? "bg-gray-100" : "bg-gray-200"
                } h-7 w-32 rounded-full`}
              ></p>
              <p
                className={`${
                  item % 2 ? "bg-gray-200" : "bg-gray-100"
                } h-4 w-10 rounded-full`}
              ></p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[1, 2].map((index) => (
          <div
            key={index}
            className="bg-white flex items-center justify-between p-4 animate-pulse mt-4"
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          >
            <p className="h-64 w-full bg-gray-200 rounded-md"></p>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeInsightShimmer;
