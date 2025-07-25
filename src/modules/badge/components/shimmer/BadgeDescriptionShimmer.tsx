const BadgeDescriptionShimmer = () => {
  return (
    <div className=" space-y-4 animate-pulse">
      <div className="flex justify-between items-center p-4 bg-white rounded shadow">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded shadow p-4">
          <div className="h-5 w-40 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, id) => (
              <div key={id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`${
                      id % 2 ? "bg-gray-200" : "bg-gray-100"
                    } w-14 h-14 rounded-full`}
                  ></div>
                  <div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <div className="h-5 w-36 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-20 h-20 bg-gray-300 rounded"></div>
                <div>
                  <div className="h-4 w-28 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-40 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeDescriptionShimmer;
