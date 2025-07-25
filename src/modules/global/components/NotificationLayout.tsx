import EmployeeNameNotification from "./EmployeeNameNotification";
import Avatar from "../../../common/Avatar";
import {
  Award,
  Trophy,
  Heart,
  Ribbon,
  ThumbsDown,
  MessageCircle,
} from "lucide-react";

const NotificationLayout = ({ data }: any) => {
  let badgeName = "";
  
  try {
    const badgeDetailsStr = data?.variables?.badgeDetails;

    if (badgeDetailsStr) {
      const badgeDetailsObj = JSON.parse(badgeDetailsStr);
      badgeName = badgeDetailsObj.name;
    }
  } catch (error) {
    console.error("Error parsing badgeDetails:", error);
  }

  const useTimeAgo = (timestamp: string | number) => {
    if (!timestamp) return "";
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds}s ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h ago`;
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days}d ago`;
    } else if (seconds < 2592000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks}w ago`;
    } else if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months}m ago`;
    } else {
      const years = Math.floor(seconds / 31536000);
      return `${years}y ago`;
    }
  };

  return (
    <>
      {data?.notificationFor === "SELF" && !data?.fromEmployeeDetail && (
        <div className="relative">
          <Avatar
            image={data?.toEmployeeDetail?.photo}
            name={`${data?.toEmployeeDetail?.firstName || ""} ${
              data?.toEmployeeDetail?.lastName || ""
            }`}
            size={60}
          />
          <div
            className="absolute top-[36px] left-[36px] rounded-full p-1"
            style={{
              backgroundColor: `${
                data?.notificationSlug === "Feed-Like"
                  ? "#ff2c55"
                  : data?.notificationSlug === "Feed-Unlike"
                  ? "#585DF9"
                  : data?.notificationSlug === "Feed-Comment"
                  ? "#00bf66"
                  : data?.notificationSlug === "Recognition-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Badge-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Award-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Award-Request"
                  ? "#585DF9"
                  : ""
              }`,
            }}
          >
            {data?.notificationSlug === "Feed-Like" ? (
              <Heart className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Feed-Unlike" ? (
              <ThumbsDown className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Feed-Comment" ? (
              <MessageCircle className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Recognition-Get" ? (
              <Ribbon className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Badge-Get" ? (
              <Award className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Award-Get" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Award-Request" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      {data?.notificationFor === "SELF" && data?.fromEmployeeDetail && (
        <div className="relative">
          <Avatar
            image={data?.fromEmployeeDetail?.photo}
            name={`${data?.fromEmployeeDetail?.firstName || ""} ${
              data?.fromEmployeeDetail?.lastName || ""
            }`}
            size={60}
          />
          <div
            className="absolute top-[36px] left-[36px] rounded-full p-1"
            style={{
              backgroundColor: `${
                data?.notificationSlug === "Feed-Like"
                  ? "#ff2c55"
                  : data?.notificationSlug === "Feed-Unlike"
                  ? "#585DF9"
                  : data?.notificationSlug === "Feed-Comment"
                  ? "#00bf66"
                  : data?.notificationSlug === "Recognition-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Badge-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Award-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Award-Request"
                  ? "#585DF9"
                  : ""
              }`,
            }}
          >
            {data?.notificationSlug === "Feed-Like" ? (
              <Heart className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Feed-Unlike" ? (
              <ThumbsDown className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Feed-Comment" ? (
              <MessageCircle className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Recognition-Get" ? (
              <Ribbon className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Badge-Get" ? (
              <Award className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Award-Get" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Award-Request" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      {data?.notificationFor === "TAGGED" && (
        <div className="relative">
          <Avatar
            image={data?.toEmployeeDetail?.photo}
            name={`${data?.toEmployeeDetail?.firstName || ""} ${
              data?.toEmployeeDetail?.lastName || ""
            }`}
            size={60}
          />
          <div
            className="absolute top-[36px] left-[36px] rounded-full p-1"
            style={{
              backgroundColor: `${
                data?.notificationSlug === "Feed-Like"
                  ? "#ff2c55"
                  : data?.notificationSlug === "Feed-Unlike"
                  ? "#585DF9"
                  : data?.notificationSlug === "Feed-Comment"
                  ? "#00bf66"
                  : data?.notificationSlug === "Recognition-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Badge-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Award-Get"
                  ? "#585DF9"
                  : data?.notificationSlug === "Award-Request"
                  ? "#585DF9"
                  : ""
              }`,
            }}
          >
            {data?.notificationSlug === "Feed-Like" ? (
              <Heart className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Feed-Unlike" ? (
              <ThumbsDown className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Feed-Comment" ? (
              <MessageCircle className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Recognition-Get" ? (
              <Ribbon className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Badge-Get" ? (
              <Award className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Award-Get" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : data?.notificationSlug === "Award-Request" ? (
              <Trophy className="w-4 h-4 text-white" />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      <div>
        {data?.notificationFor === "SELF" && !data?.fromEmployeeDetail && (
          <p className="rounded text-sm">
            {data?.notificationSlug === "Recognition-Get" &&
              "Congratulations, you got your first recognition!"}
            {data?.notificationSlug === "Badge-Get" &&
              `Congratulations, you just hit a milestone and earned ${badgeName} badge!`}
            {data?.notificationSlug === "Award-Get" &&
              "Congratulations, you just earned a brand new award!"}
          </p>
        )}

        {data?.notificationFor === "SELF" && data?.fromEmployeeDetail && (
          <>
            {data?.notificationSlug === "Award-Request" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                requested an award.
              </p>
            )}
            {data?.notificationSlug === "Feed-Like" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                loves your feed and just liked it!
              </p>
            )}

            {data?.notificationSlug === "Feed-Comment" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                commented on your feed, check it out.
              </p>
            )}
            {data?.notificationSlug === "Award-Get" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                gave the green light to your award request. Congratulations!
              </p>
            )}
            {data?.notificationSlug === "Recognition-Get" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                sent you a recognition. Great job, you totally deserved it!
              </p>
            )}
            {data?.notificationSlug === "Badge-Get" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                gave you a shiny new badge. Kudos to you!
              </p>
            )}
            {data?.notificationSlug === "Comment-Create" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                added a comment on growth conversation!
              </p>
            )}
            {data?.notificationSlug === "Conversation-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                initiated a growth conversation.
              </p>
            )}
            {data?.notificationSlug === "Discussion-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                added dicussion notes to a growth conversation.
              </p>
            )}
            {data?.notificationSlug === "Task-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />
                added a new task to their goal.
              </p>
            )}
            {data?.notificationSlug === "Goal-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />
                just created a new goal.
              </p>
            )}
          </>
        )}

        {data?.notificationFor === "TAGGED" && (
          <p className="text-[#73737D] rounded text-sm">
            {data?.notificationSlug === "Feed-Like" && (
              <>
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />
                appreciates{" "}
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />
                's feed and just liked it.
              </>
            )}

            {data?.notificationSlug === "Feed-Comment" && (
              <>
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                commented on{" "}
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />
                's feed, check it out.
              </>
            )}

            {data?.notificationSlug === "Award-Request" && (
              <>
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                has submitted a request for an award.
              </>
            )}

            {data?.notificationSlug === "Recognition-Get" && (
              <>
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                got a recognition from{" "}
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />
                {""}, see it here.
              </>
            )}
          </p>
        )}

        <p className="text-[#878791] font-normal text-sm">
          {useTimeAgo(data?.createdAt)}
        </p>
      </div>
      {data?.status === "unseen" && <div></div>}
    </>
  );
};

export default NotificationLayout;
