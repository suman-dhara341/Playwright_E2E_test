import React, { useState, useEffect } from "react";
import {
  AwardDetails,
  BadgeDetails,
  DetailsProps,
  RecognitionDetails,
} from "../interfaces";
import { Award, Trophy } from "lucide-react";

const DetailsDisplay: React.FC<DetailsProps> = ({ details, type }) => {
  const [badgeDetails, setBadgeDetails] = useState<BadgeDetails | null>(null);
  const [recognitionDetails, setRecognitionDetails] =
    useState<RecognitionDetails | null>(null);
  const [awardDetails, setAwardDetails] = useState<AwardDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (details?.details?.badgeDetails) {
        const parsedBadgeDetails: BadgeDetails = JSON.parse(
          details?.details?.badgeDetails
        );
        setBadgeDetails(parsedBadgeDetails);
      }
      if (details?.details?.recognitionDetails) {
        const parsedRecognitionDetails: RecognitionDetails = JSON.parse(
          details?.details?.recognitionDetails
        );
        setRecognitionDetails(parsedRecognitionDetails);
      }
      if (details?.details?.awardDetails) {
        const parsedAwardDetails: AwardDetails = JSON.parse(
          details?.details?.awardDetails
        );
        setAwardDetails(parsedAwardDetails);
      }
    } catch (e) {
      setError("Failed to parse some details.");
    }
  }, [details]);

  return (
    <div className="flex flex-column items-center px-3">
      {error && <p>{error}</p>}

      {recognitionDetails && (
        <div className="mb-3 w-100 text-sm">
          <p>{recognitionDetails.recognitionContent}</p>
        </div>
      )}

      {/* Badge Details */}
      {badgeDetails && (
        <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-teal-100 via-purple-100 to-pink-100 w-full mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-lg font-extrabold">{badgeDetails?.name}</p>
            </div>
            <p className="text-sm italic">{badgeDetails?.description}</p>
          </div>
          <img
            src={badgeDetails?.badgePhoto}
            alt={`${badgeDetails.name} badge`}
            className="bg-white p-2 rounded-xl shadow-lg object-contain transition-transform duration-300 hover:scale-105 w-1/3 h-auto"
          />
        </div>
      )}

      {/* Award Details */}
      {awardDetails && (
        <div className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-100 via-pink-100 to-yellow-100">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-base font-extrabold">
                {awardDetails.awardName}
              </p>
            </div>
            <p className="text-sm italic">{awardDetails.description}</p>
          </div>

          <img
            src={awardDetails.awardPhoto}
            alt={`${awardDetails.awardName} award`}
            className={`bg-white rounded-xl shadow-lg object-contain transition-transform duration-300 hover:scale-105 ${
              type === "commentModal" ? "w-2/5" : "w-1/3"
            } h-auto`}
          />
        </div>
      )}

      {!badgeDetails && !recognitionDetails && !awardDetails && !error && (
        <p>No details available.</p>
      )}
    </div>
  );
};

export default DetailsDisplay;
