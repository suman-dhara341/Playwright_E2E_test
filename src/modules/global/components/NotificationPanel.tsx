import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetNotificationCountQuery,
  useLazyGetNotificationListQuery,
} from "../queries/globalQuery";
import { debounce } from "lodash";
import NotificationLayout from "./NotificationLayout";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { BellIcon } from "lucide-react";
import Loading from "../../../utilities/Loading";
import { showToast } from "../../../utilities/toast";

const NotificationPanel = () => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const notificationUpdateFirebase = useSelector(
    (state: any) => state.message.messages
  );
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const [notificationShow, setNotificationShow] = useState(false);
  const [localNotificationCount, setLocalNotificationCount] = useState(0);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [containerElement, setContainerElement] = useState<any>(null);

  const parsedMessages = notificationUpdateFirebase?.map((msg: any) =>
    typeof msg === "string" ? JSON.parse(msg) : msg
  );

  const [
    triggerNotificationList,
    {
      data: notificationList,
      isLoading: notificationListIsLoading,
      isUninitialized: isNotificationListUninitialized,
    },
  ] = useLazyGetNotificationListQuery();

  const {
    data: notificationCount,
    refetch: notificationCountRefetch,
    isUninitialized: isNotificationCountUninitialized,
  } = useGetNotificationCountQuery({ ORG_ID, EMP_ID });

  useEffect(() => {
    if (notificationCount?.message !== "0") {
      console.log("not trigger");
    } else {
      triggerNotificationList({ ORG_ID, EMP_ID, nextToken });
    }
  }, [ORG_ID, EMP_ID, nextToken]);

  const domainName = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ":" + window.location.port : ""
  }`;

  const handleClickToRedirect = (data: any) => {
    const { notificationSlug, serviceRecordId } = data;
    let linkToNavigate = "";
    switch (notificationSlug) {
      case "notification-Request":
        linkToNavigate = `${domainName}/notifications/${serviceRecordId}`;
        break;
      case "Award-Request":
        linkToNavigate = `${domainName}/awards/${serviceRecordId}`;
        break;
      case "Goal-Create":
        linkToNavigate = `${domainName}/goal-details/${serviceRecordId}`;
        break;
      case "Task-Create":
        linkToNavigate = `${domainName}/managerHub?tab=My Team`;
        break;
      case "Feed-Like":
      case "Feed-Comment":
      case "notification-Get":
      case "Recognition-Get":
        linkToNavigate = `${domainName}/feed/feed-link/${serviceRecordId}`;
        break;
      default:
        console.warn("Unknown notification type:", notificationSlug);
        return;
    }
    if (linkToNavigate) {
      window.location.href = linkToNavigate;
    }
  };

  const handleScroll = debounce(() => {
    if (containerElement?.current) {
      const container = containerElement.current;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10;

      if (isAtBottom && !hasReachedBottom) {
        setHasReachedBottom(true);
        setNextToken(notificationList?.nextToken);
      } else if (!isAtBottom) {
        setHasReachedBottom(false);
      }
    }
  }, 100);

  const handleNotificationBoxOpen = async () => {
    setNotificationShow(!notificationShow);
    setLocalNotificationCount(0);
    try {
      const result = await triggerNotificationList({
        ORG_ID,
        EMP_ID,
        nextToken,
      });
      if (result?.data) {
        await notificationCountRefetch();
      }
    } catch (error: any) {
      showToast(
        error?.data?.message || "Failed to fetch notification list:",
        "error"
      );
    }
  };

  useEffect(() => {
    if (parsedMessages.length > 0) {
      setNotificationsData((prev) => {
        const existingIds = new Set(prev.map((n) => n.notificationId));
        const newNotifs = parsedMessages.filter(
          (msg: any) => !existingIds.has(msg.notificationId)
        );
        return [...newNotifs, ...prev];
      });
    }
  }, [notificationUpdateFirebase]);

  useEffect(() => {
    if (notificationCount?.message) {
      setLocalNotificationCount(Number(notificationCount.message));
    }
  }, [notificationCount]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerElement(containerRef);
    }
  }, [notificationShow, containerRef]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setNotificationShow(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!isNotificationCountUninitialized && !isNotificationListUninitialized) {
      notificationCountRefetch();
    }
  }, [notificationUpdateFirebase]);

  useEffect(() => {
    return () => {
      handleScroll.cancel();
    };
  }, []);

  useEffect(() => {
    if (notificationShow && containerElement?.current) {
      containerElement.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (containerElement?.current) {
        containerElement.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [notificationShow, containerElement]);

  useEffect(() => {
    const newData = notificationList?.data;
    if (newData && newData.length > 0) {
      setNotificationsData((prev) => {
        const existingIds = new Set(prev.map((n) => n.notificationId));
        const newNotifs = newData.filter(
          (n) => !existingIds.has(n.notificationId)
        );
        return [...newNotifs, ...prev];
      });
      setIsLoadingMore(false);
    }
    setHasReachedBottom(false);
  }, [notificationList]);

  useEffect(() => {
    if (nextToken) setIsLoadingMore(true);
  }, [nextToken]);

  return (
    <div
      ref={panelRef}
      className="relative flex flex-col justify-center items-center"
    >
      <div
        onClick={handleNotificationBoxOpen}
        className="flex flex-col items-center cursor-pointer"
      >
        <div className="relative group">
          <BellIcon
            className={`w-5 h-5 ${
              notificationShow ? "text-[#585DF9]" : "text-[#3F4354]"
            } group-hover:animate-wiggle`}
          />
          {localNotificationCount > 0 && (
            <div className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
              {localNotificationCount}
            </div>
          )}
        </div>
        <p
          className={`text-sm ${
            notificationShow ? "text-[#585DF9]" : "text-[#3F4354]"
          } font-semibold`}
        >
          Notification
        </p>
      </div>

      {notificationShow && (
        <div className="absolute top-12 w-[350px] max-h-[90vh] bg-white rounded-md shadow-lg overflow-hidden border border-gray-200 z-50">
          <div ref={containerRef} className="overflow-y-auto h-[90vh]">
            {notificationListIsLoading ? (
              <div className="flex justify-center items-center h-[calc(100vh-90px)]">
                <Loading />
              </div>
            ) : notificationsData.length === 0 ? (
              <div className="py-4 text-center text-[#73737D]">
                No notifications available
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 p-0">
                {notificationsData.map((data) => (
                  <li
                    key={data?.notificationId}
                    onClick={() => handleClickToRedirect(data)}
                    className={`flex gap-3 cursor-pointer px-3 py-2 hover:!bg-gray-100 ${
                      data?.status === "unseen" ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <NotificationLayout data={data} />
                  </li>
                ))}
              </ul>
            )}
            {isLoadingMore && (
              <div className="p-3 flex justify-center">
                <ThreeDotsLoading color="#585DF9" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
