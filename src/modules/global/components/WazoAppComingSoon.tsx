import PlayStore from "/images/play-store.png";
import AppStore from "/images/app-store.png";
import ResponsiveLogo from "/images/logo.png";

const WazoAppComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-2xl sm:text-4xl font-extrabold text-[#3F4354]">
          Wazo Mobile App
        </p>
        <p className="text-md sm:text-xl text-[#3F4354] mt-2">
          The app is coming soon! Stay tuned for exciting features.
        </p>
      </div>

      {/* App Logo */}
      <div className="w-40 h-40 sm:w-64 sm:h-64 rounded-xl flex items-center justify-center text-white shadow-xl transform hover:scale-105 transition duration-300 ease-in-out mb-8">
        <img src={ResponsiveLogo} alt="App Logo" className="w-full h-full object-contain rounded-md" />
      </div>

      {/* Buttons Section */}
      <p className="mb-3 text-[#3F4354] text-lg font-semibold">Download the app on</p>
      <div className="flex flex-col sm:flex-row gap-3 items-center ">
        
        <a
          href="#"
          className="flex items-center justify-center w-64 bg-gradient-to-b from-green-400 to-blue-500 text-white py-3 px-6 rounded-md shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <img src={PlayStore} alt="Play Store" className="w-8 h-8 mr-3" />
          <span className="text-lg font-semibold">Play Store</span>
        </a>
        <a
          href="#"
          className="flex items-center justify-center w-64 bg-gradient-to-b from-black to-gray-800 text-white py-3 px-6 rounded-md shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <img src={AppStore} alt="App Store" className="w-8 h-8 mr-3" />
          <span className="text-lg font-semibold">App Store</span>
        </a>
      </div>
    </div>
  );
};

export default WazoAppComingSoon;
