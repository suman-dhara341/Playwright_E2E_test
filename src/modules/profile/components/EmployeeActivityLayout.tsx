import Avatar from "../../../common/Avatar";
import {
  Award,
  Heart,
  MessageCircle,
  MessageSquareShare,
  Ribbon,
  ThumbsDown,
  Trophy,
} from "lucide-react";
import EmployeeNameNotification from "../../global/components/EmployeeNameNotification";
import { useTimeAgo } from "../../../utilities/hooks/useTimeAgo";

const EmployeeActivityLayout = ({ data, profileOwner }: any) => {
  const profileName = profileOwner ? (
    "You"
  ) : (
    <EmployeeNameNotification
      firstName={data?.fromEmployeeDetail?.firstName}
      middleName={data?.fromEmployeeDetail?.middleName}
      lastName={data?.fromEmployeeDetail?.lastName}
      empId={data?.fromEmployeeDetail?.employeeId}
    />
  );
  return (
    <>
      {data?.notificationFor === "SELF" && data?.toEmployeeDetail && (
        <div className="relative">
          <Avatar
            image={data?.toEmployeeDetail?.photo}
            name={`${data?.toEmployeeDetail?.firstName || ""} ${
              data?.toEmployeeDetail?.lastName || ""
            }`}
            size={45}
          />
          <div
            className="absolute top-[25px] left-[25px] rounded-full p-1"
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
                  : data?.notificationSlug === "Conversation-Create"
                  ? "#585DF9"
                  : data?.notificationSlug === "Discussion-Create"
                  ? "#585DF9"
                  : ""
              }`,
            }}
          >
            {data?.notificationSlug === "Feed-Like" ? (
              <Heart className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Feed-Unlike" ? (
              <ThumbsDown className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Feed-Comment" ? (
              <MessageCircle className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Recognition-Get" ? (
              <Ribbon className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Badge-Get" ? (
              <Award className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Award-Get" ? (
              <Trophy className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Award-Request" ? (
              <Trophy className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Conversation-Create" ? (
              <MessageSquareShare className="w-3 h-3 text-white" />
            ) : data?.notificationSlug === "Discussion-Create" ? (
              <MessageSquareShare className="w-3 h-3 text-white" />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      <div>
        {data?.notificationFor === "SELF" && data?.toEmployeeDetail && (
          <>
            {data?.notificationSlug === "Award-Request" && (
              <p className="rounded text-sm">
                <EmployeeNameNotification
                  firstName={data?.fromEmployeeDetail?.firstName}
                  middleName={data?.fromEmployeeDetail?.middleName}
                  lastName={data?.fromEmployeeDetail?.lastName}
                  empId={data?.fromEmployeeDetail?.employeeId}
                />{" "}
                request a award.
              </p>
            )}
            {data?.notificationSlug === "Feed-Like" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} {" "}
                liked{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                feed.
              </p>
            )}
            {data?.notificationSlug === "Feed-Comment" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} commented on{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
                feed.
              </p>
            )}
            {data?.notificationSlug === "Award-Get" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} approved award request from{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />
              </p>
            )}
            {data?.notificationSlug === "Recognition-Get" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} gave a recognition to{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
              </p>
            )}
            {data?.notificationSlug === "Badge-Get" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} gave a badge to{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />{" "}
              </p>
            )}
            {data?.notificationSlug === "Conversation-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} initiated a growth conversation with{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />
              </p>
            )}
            {data?.notificationSlug === "Discussion-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} added dicussion notes to{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />
                's growth conversation.
              </p>
            )}
            {data?.notificationSlug === "Comment-Create" &&
              data?.notificationType === "Growth" && (
                <p className="text-[#73737D] rounded text-sm">
                  {profileName} commented on a growth conversation of{" "}
                  <EmployeeNameNotification
                    firstName={data?.toEmployeeDetail?.firstName}
                    middleName={data?.toEmployeeDetail?.middleName}
                    lastName={data?.toEmployeeDetail?.lastName}
                    empId={data?.toEmployeeDetail?.employeeId}
                  />
                </p>
              )}
            {data?.notificationSlug === "Comment-Create" &&
              data?.notificationType === "Goal" && (
                <p className="text-[#73737D] rounded text-sm">
                  {profileName} commented on a Goal{" "}
                  <EmployeeNameNotification
                    firstName={data?.toEmployeeDetail?.firstName}
                    middleName={data?.toEmployeeDetail?.middleName}
                    lastName={data?.toEmployeeDetail?.lastName}
                    empId={data?.toEmployeeDetail?.employeeId}
                  />
                </p>
              )}
            {data?.notificationSlug === "Goal-Create" && (
              <p className="text-[#73737D] rounded text-sm">
                {profileName} created a goal with{" "}
                <EmployeeNameNotification
                  firstName={data?.toEmployeeDetail?.firstName}
                  middleName={data?.toEmployeeDetail?.middleName}
                  lastName={data?.toEmployeeDetail?.lastName}
                  empId={data?.toEmployeeDetail?.employeeId}
                />
              </p>
            )}
          </>
        )}

        <p className="text-[#878791] font-normal text-xs">
          {useTimeAgo(data?.createdAt)}
        </p>
      </div>
    </>
  );
};

export default EmployeeActivityLayout;
