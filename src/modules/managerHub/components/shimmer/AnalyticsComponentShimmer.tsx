const AwardComponentsShimmer = () => {
  return (
    <div className="bg-white rounded-md w-full animate-pulse">
      <div className="flex flex-row gap-x-3 w-full mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full">
            <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="flex justify-end items-end">
        <div className="w-full h-[calc(100vh-270px)] flex items-center justify-center">
          <div className="w-full h-full bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default AwardComponentsShimmer;
