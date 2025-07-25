const IndexShimmer = () => {
  return (
    <div className="animate-pulse">
      <h1 className="!text-2xl !text-[#4F4F51] m-0 py-2">Hierarchy</h1>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-[calc(100vh-150px)] p-3 bg-white rounded-md shadow-sm col-span-2 animate-pulse">
          <div className="w-full h-full bg-gray-100 rounded" />
        </div>

        <div
          className="bg-white rounded-md p-4 animate-pulse"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-[75px] h-[75px] bg-gray-200 rounded-full" />
          </div>

          <div className="text-center mb-4 flex flex-col gap-2 animate-pulse">
            <p className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
            <p className="h-3 w-3/4 mx-auto bg-gray-200 rounded" />
            <p className="h-3 w-3/5 mx-auto bg-gray-200 rounded" />
            <p className="h-3 w-3/4 mx-auto bg-gray-200 rounded" />
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-[#73737D] mb-2">Awards</p>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-[#73737D] mb-2">Badges</p>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded" />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-[#73737D] mb-2">
              Recognition
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>

          <p className="bg-gray-200 h-10 w-full mt-4 rounded-full"></p>
        </div>
      </div>
    </div>
  );
};

export default IndexShimmer;
