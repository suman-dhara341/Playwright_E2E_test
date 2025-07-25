import SimilarAwardShimmer from "./SimilarAwardShimmer";

const AwardDescriptionShimmer = () => {
  return (
    <div className="grid grid-cols-3 gap-3 space-y-4 animate-pulse">
      <div className="col-span-2 flex flex-col gap-3">
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

        <div className="bg-white p-4 rounded shadow space-y-3">
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
              </div>
              <div className="h-3 w-20 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-1 flex flex-col gap-3  p-4 rounded space-y-4">
        <div
          className="flex flex-col p-3 bg-white rounded-md gap-3 animate-pulse"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 p-3 bg-gray-100 rounded">
                <div className="h-5 w-12 bg-gray-300 rounded mb-2"></div>
                <div className="h-9 w-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
        <SimilarAwardShimmer grid={3} length={6} />
      </div>
    </div>
  );
};

export default AwardDescriptionShimmer;
