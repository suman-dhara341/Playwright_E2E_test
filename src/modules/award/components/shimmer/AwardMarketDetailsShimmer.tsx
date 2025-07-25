const AwardMarketDetailsShimmer = () => {
  return (
    <div className="gap-3 space-y-4 animate-pulse">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row justify-between bg-white rounded-md shadow p-4 gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-60 bg-gray-200 rounded"></div>
            <div className="h-16 w-full bg-gray-200 rounded"></div>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
              <div className="h-4 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-24 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
        </div>

        <div className="bg-white p-4 rounded shadow space-y-3">
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3 w-full">
                <div className="h-6 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwardMarketDetailsShimmer