const NoFeedAvailable = () => {
  return (
    <div
      className="h-[85vh] flex items-center justify-center bg-white rounded-md p-3 mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="text-center">
        <svg
          width="150"
          height="150"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4 mx-auto"
        >
          <defs>
            <radialGradient id="sadGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a1c4fd" stopOpacity="1" />
              <stop offset="100%" stopColor="#c2e9fb" stopOpacity="1" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#sadGradient)" />
          <circle cx="8.5" cy="10" r="1.2" fill="#333">
            <animate
              attributeName="cy"
              values="10;10.5;10"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="15.5" cy="10" r="1.2" fill="#333">
            <animate
              attributeName="cy"
              values="10;10.5;10"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <path
            d="M9 15c1.5 -2 4.5 -2 6 0"
            stroke="#333"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          >
            <animate
              attributeName="d"
              values="M9 15c1.5 -2 4.5 -2 6 0; M9 14.5c1.5 -1.5 4.5 -1.5 6 0; M9 15c1.5 -2 4.5 -2 6 0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Text */}
        <p className="text-lg font-semibold text-[#73737D]">
          No Feed Available
        </p>
        <p className="text-sm text-[#73737D]">
          We're sad to see this empty! Check back later for more updates.
        </p>
      </div>
    </div>
  );
};

export default NoFeedAvailable;
