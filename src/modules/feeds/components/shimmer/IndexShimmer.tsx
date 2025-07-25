const IndexShimmer = () => {
  return (
    <div
      className="bg-white rounded-md p-3 animate-pulse"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      {/* Avatar */}
      <div className="flex justify-center mb-3">
        <div className="w-[75px] h-[75px] bg-gray-200 rounded-full" />
      </div>

      {/* Name and Description */}
      <div className="text-center">
        <p className="h-4 w-1/2 mx-auto bg-gray-200 rounded mb-2" />
        <p className="h-3 w-3/4 mx-auto bg-gray-200 rounded" />
      </div>

      {/* Contact Info */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <p className="h-3 w-40 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <p className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Awards */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#73737D] mb-2">Awards</p>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#73737D] mb-2">Badges</p>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>

      {/* Recognition */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-[#73737D] mb-2">Recognition</p>
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full" />
          ))}
        </div>
      </div>

      {/* Reports To */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-[#73737D]">Reports To</p>
        <p className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default IndexShimmer;
