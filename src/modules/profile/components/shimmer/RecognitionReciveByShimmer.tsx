const RecognitionReciveByShimmer = () => {
  return (
    <div className="min-h-[50vh] bg-white rounded-md">
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start border-b border-gray-200 py-4 px-4"
          >
            {/* Left Section */}
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>

              {/* Text Content */}
              <div className="space-y-2">
                {/* Name & Time */}
                <div className="flex items-center gap-3">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded"></div>
                </div>

                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded-full"></div>
                </div>

                {/* Message */}
                <div className="h-4 w-72 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Badge */}
            <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecognitionReciveByShimmer;
