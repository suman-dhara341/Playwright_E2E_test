import { useNavigate } from "react-router-dom";
import { Badge } from "../interfaces";

const PopularBadgeCard = ({ badges, styleClasses }: any) => {

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
      {Array.from(badgeMap.values()).map(({ badge }, index: number) => {
        return (
          <div
            className={`bg-white rounded-md flex pb-3 gap-2
             items-center justify-center cursor-pointer`}
            key={index}
            onClick={() => handleCardClick(badge)}
          >
            <div className={`w-[70px] h-[70px] m-auto`}>
              <img src={badge?.badgePhoto} alt={badge.name} />
            </div>
            <div className={`flex flex-1 flex-col`}>
              <p className="text-sm font-semibold text-[#3F4354]">
                {badge.name.length > 18
                  ? `${badge.name.slice(0, 18)}...`
                  : badge.name}
              </p>
              <div className={`flex items-center text-[#878791]`}>
                <span className="text-xs text-[#73737D] leading-[16px]">
                  {badge.description.length > 35
                  ? `${badge.description.slice(0, 35)}...`
                  : badge.description}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PopularBadgeCard;
