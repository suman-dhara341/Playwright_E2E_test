const AnonimityComponentShimmer = () => {
  return (
    <div className="flex gap-3 w-full h-[calc(100vh-175px)] mb-3 animate-pulse">
      <div
        className="w-[25%] flex flex-col bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
      >
        <div className="p-3">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-3" />
          <div className="space-y-2 overflow-y-auto">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-9 w-full bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>

      <div
        className="w-[75%] flex flex-col bg-white rounded-md p-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />

        <div className="flex items-center justify-center w-full">
          <p className="w-56 h-6 bg-gray-200 rounded mb-3"></p>
        </div>

        <div className="h-full w-full bg-gray-100 rounded" />
      </div>
    </div>
  );
};

export default AnonimityComponentShimmer;
