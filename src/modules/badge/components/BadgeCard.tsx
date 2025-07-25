import { useNavigate } from "react-router-dom";
import { Badge } from "../interfaces";
import { Award } from "lucide-react";

const BadgeCard = ({ badges, badgeType, styleClasses }: any) => {
  const navigate = useNavigate();
  const badgeMap = new Map<string, { badge: Badge; count: number }>();
  badges?.forEach((badge: Badge) => {
    if (badgeMap.has(badge.category)) {
      badgeMap.get(badge.category)!.count += 1;
    } else {
      badgeMap.set(badge.category, { badge, count: 1 });
    }
  });

  const handleCardClick = (badge: Badge) => {
    const badgeType = badge.type;
    const badgeCategory = badge.category;
    const queryParams = new URLSearchParams({
      badgeType,
      badgeCategory,
    }).toString();
    navigate(`/description?${queryParams}`);
  };

  return (
    <div className={styleClasses}>
      {Array.from(badgeMap.values()).map(({ badge, count }, index: number) => {
        return (
          <div
            className={`bg-white rounded-md ${
              badgeType === "All Badges"
                ? "flex flex-col justify-center pt-4 pb-3 relative"
                : badgeType === "Popular Badges"
                ? "flex pb-2"
                : "block p-3"
            }
            ${
              badgeType === "All Badges" ? "" : "text-center"
            } items-center justify-center ${
              badgeType === "All Badges"
                ? "gap-0"
                : badgeType === "Popular Badges"
                ? "gap-0"
                : "gap-1"
            } cursor-pointer`}
            style={badgeType === "All Badges" ? { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 4px' } : {}}
            key={index}
            onClick={() => handleCardClick(badge)}
          >
            <div
              className={`${
                badgeType === "All Badges" ? "w-[120px] h-[120px]" : " w-[75px] h-[75px] m-auto"
              }`}
            >
              <img src={badge?.badgePhoto} alt={badge.name} />
            </div>
            <div
              className={`flex flex-1 ${
                badgeType === "All Badges" ? "flex-col" : "flex-col"
              }`}
            >
              {badgeType === "All Badges" || "My Badges" ?<p className="text-base text-center font-semibold text-[#3F4354]">
                {badgeType === "All Badges"
                  ? badge.name
                  : badge.name.length > 18
                  ? `${badge.name.slice(0, 18)}...`
                  : badge.name}
              </p>: <p className="text- text-center font-semibold text-[#3F4354]">
                {badgeType === "My Badges Overview"
                  ? badge.name
                  : badge.name.length > 18
                  ? `${badge.name.slice(0, 18)}...`
                  : badge.name}
              </p>}
              <div
                className={`flex items-center justify-center ${
                  badgeType === "All Badges" ? "" : "justify-center"
                } text-[#878791]`}
              >
                {badgeType === "All Badges" ? (
                  <div className="bg-[#F4F6F8] rounded-tr-md px-2 flex gap-1 items-center justify-center absolute top-0 right-0">
                    <Award className="text-[#858EAD] w-4 h-4"/>
                    <span className="text-xs text-[#858EAD] leading-[24px]">{badge.totalReceiver}</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#73737D] leading-[16px]">
                    Received {count} times
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeCard;
