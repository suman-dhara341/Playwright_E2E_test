import * as Yup from "yup";
import EmployeeName from "../../../common/EmployeeName";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import FeedContentBadgeDetails from "./FeedContentBadgeDetails";
import {
  useFeedCommentMutation,
  useGetFeedCommentListQuery,
} from "../queries/feedQuery";
import { useFormik } from "formik";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { Heart, MessageCircle, Send, Smile, X } from "lucide-react";
import Avatar from "../../../common/Avatar";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import Loading from "../../../utilities/Loading";
import { Modal } from "@mui/material";
import { showToast } from "../../../utilities/toast";

const validationSchema = Yup.object().shape({
  commentContent: Yup.string().required("Feed comment is required"),
});

const CommentListModal = ({
  close,
  open,
  feedId,
  feedData,
  ORG_ID,
  EMP_ID,
  commentCount,
  setCommentCount,
  likeCount,
}: any) => {
  const [isLike, setIsLike] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [nextTokenComment] = useState<string | null>(null);

  const [feedComment, { isLoading: feedCommentIsLoading }] =
    useFeedCommentMutation();
  const {
    data: feedCommentList,
    error: feedCommentListError,
    isLoading: feedCommentListIsLoading,
    refetch: feedCommentListRefetch,
  } = useGetFeedCommentListQuery({ ORG_ID, feedId, nextTokenComment });
  const { data: profile } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const imageUrl = profile?.data?.photo;
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  const useTimeAgo = (timestamp: string | number) => {
    if (!timestamp) return "";
    const now = new Date();
    const time = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days}d`;
    } else if (seconds < 2592000) {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks}w`;
    } else if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      return `${months}m`;
    } else {
      const years = Math.floor(seconds / 31536000);
      return `${years}y`;
    }
  };

  useEffect(() => {
    if (feedData.isLike) {
      setIsLike(true);
    }
  }, [feedData, EMP_ID]);

  const formik = useFormik({
    initialValues: {
      commentContent: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formattedValues = {
        ...values,
        employeeId: EMP_ID,
      };
      try {
        await feedComment({
          ORG_ID,
          feedId,
          feedCommentData: formattedValues,
        }).unwrap();
        resetForm();
        feedCommentListRefetch();
        setCommentCount((prevCount: any) => prevCount + 1);
      } catch (err: any) {
        showToast(err?.data?.message || "Failed to comment on feed: ", "error");
      }
    },
  });

  const handleClose = () => {
    setIsEmojiPickerVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    formik.setFieldValue(
      "commentContent",
      formik.values.commentContent + emoji
    );
  };

  return (
    <Modal open={open} onClose={close}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg w-[40%] overflow-hidden">
        <div>
          <div className="flex w-full justify-between border-b-1 border-[#E8E8EC]">
            <div className="w-full flex p-3 items-center justify-center">
              <EmployeeName
                firstName={feedData?.feedReceivedBy?.firstName}
                middleName={feedData?.feedReceivedBy?.middleName}
                lastName={feedData?.feedReceivedBy?.lastName}
                empId={feedData?.feedReceivedBy?.employeeId}
                textColor={"!text-[#585DF9]"}
                fontWeight={"font-semibold"}
                textVarient={"!text-xl"}
              />
              <p className="text-xl leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
                's Feed
              </p>
            </div>
            <div
              onClick={close}
              className="flex items-center px-3 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </div>
          </div>
          <div className="h-[70vh] overflow-y-auto mb-3">
            <ul className="p-0 m-0">
              <li className="flex items-start gap-3 p-3">
                <div>
                  <Avatar
                    image={feedData?.feedReceivedBy?.photo}
                    name={feedData?.feedReceivedBy?.firstName}
                    size={45}
                  />
                </div>
                <div className="flex flex-column items-start">
                  <div className="flex flex-wrap gap-1 items-center">
                    <EmployeeName
                      firstName={feedData?.feedReceivedBy?.firstName}
                      middleName={feedData?.feedReceivedBy?.middleName}
                      lastName={feedData?.feedReceivedBy?.lastName}
                      empId={feedData?.feedReceivedBy?.employeeId}
                      textColor={"!text-[#585DF9]"}
                      fontWeight={"font-semibold"}
                      textVarient={"!text-base"}
                    />
                    {feedData?.feedGivenBy?.firstName ? (
                      <>
                        <p className="text-sm">
                          received {feedData?.serviceName?.toLowerCase()}
                        </p>
                        <p className="text-sm">from</p>
                        <EmployeeName
                          firstName={feedData?.feedGivenBy?.firstName}
                          middleName={feedData?.feedGivenBy?.middleName}
                          lastName={feedData?.feedGivenBy?.lastName}
                          empId={feedData?.feedGivenBy?.employeeId}
                          textColor={"!text-[#585DF9]"}
                          fontWeight={"font-semibold"}
                          textVarient={"!text-base"}
                        />
                      </>
                    ) : (
                      <p className="text-sm">achieved a milestone</p>
                    )}
                  </div>
                  <p className="text-[#878791] font-normal text-sm">
                    {useTimeAgo(feedData.createdAt)}
                  </p>
                </div>
              </li>
              <li className="p-0">
                <div className="w-100">
                  <div className="mb-3">
                    <FeedContentBadgeDetails
                      details={feedData}
                      type={"commentModal"}
                    />
                  </div>
                  <div className="flex justify-between border-t-1 border-[#E8E8EC] p-3">
                    <div className="flex items-center gap-2 pointer-events-none">
                      <button>
                        {isLike ? (
                          <Heart
                            className="w-5 h-5"
                            fill="#FF2C55"
                            color="#FF2C55"
                          />
                        ) : (
                          <Heart className="w-5 h-5" />
                        )}
                      </button>
                      <button disabled={likeCount == 0 ? true : false}>
                        {likeCount == 0 ? "" : likeCount} Likes
                      </button>
                    </div>
                    {commentCount !== 0 && (
                      <div className="flex items-center gap-2 pointer-events-none">
                        <button aria-label="comment">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button disabled={commentCount === 0}>
                          {commentCount == 0 ? "" : commentCount} Comments
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            </ul>
            <div className="px-4 mb-2">
              <p className="text-sm leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
                All Comments
              </p>
            </div>

            <div>
              {feedCommentListIsLoading && (
                <div className="flex justify-center">
                  <ThreeDotsLoading color="#585DF9" />
                </div>
              )}

              {feedCommentListError && <p>Failed to load comments</p>}

              {!feedCommentListIsLoading && !feedCommentListError && (
                <ul className="px-3">
                  {feedCommentList?.data?.map((commentData: any) => (
                    <li
                      key={commentData.commentContent}
                      className="flex items-center gap-3 py-1 "
                    >
                      <div>
                        <Avatar
                          image={commentData.employee.photo}
                          size={45}
                          name={commentData.employee.firstName}
                        />
                      </div>
                      <div className="">
                        <div className="bg-[#edf3f8] rounded-md p-2 mb-1">
                          <EmployeeName
                            firstName={commentData.employee.firstName}
                            middleName={commentData.employee.middleName}
                            lastName={commentData.employee.lastName}
                            empId={commentData.employee.employeeId}
                            textColor={"!text-[#585DF9]"}
                            fontWeight={"font-semibold"}
                            textVarient={"!text-base"}
                          />
                          <p className="m-0">{commentData.commentContent}</p>
                        </div>

                        <p className="text-[#878791] font-normal text-sm">
                          {useTimeAgo(commentData.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!feedCommentListIsLoading &&
                !feedCommentListError &&
                feedCommentList?.data?.length === 0 && (
                  <p>No comments available.</p>
                )}
            </div>
          </div>
          <div className="relative">
            <form className="flex gap-3 p-3" onSubmit={formik.handleSubmit}>
              <div>
                <Avatar
                  name={profile?.data?.firstName || ""}
                  image={imageWithTimestamp}
                  size={45}
                />
              </div>
              <div className="w-full flex items-center border-1 border-[#E8E8EC] rounded-full px-3">
                <input
                  name="commentContent"
                  className="w-full focus-visible:outline-none"
                  placeholder="Add a comment..."
                  value={formik.values.commentContent}
                  onChange={formik.handleChange}
                />
                <div className="flex gap-3">
                  <div
                    onClick={() =>
                      setIsEmojiPickerVisible(!isEmojiPickerVisible)
                    }
                  >
                    <Smile className="text-[#fbbb12] w-5 h-5" />
                  </div>
                  <button
                    type="submit"
                    disabled={
                      feedCommentIsLoading ||
                      !formik.values.commentContent.trim()
                    }
                  >
                    {feedCommentIsLoading ? (
                      <Loading />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </form>

            {isEmojiPickerVisible && (
              <div
                ref={emojiPickerRef}
                className="absolute top-[-440px] right-5"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentListModal;
