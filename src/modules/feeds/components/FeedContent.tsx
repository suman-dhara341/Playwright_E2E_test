import * as Yup from "yup";
import {
  useFeedCommentMutation,
  useLazyGetFeedLikeListQuery,
  useLazyGetFeedLikeQuery,
} from "../queries/feedQuery";
import { useFormik } from "formik";
import { useState, useEffect, useRef } from "react";
import CommentListModal from "./CommentListModal";
import LikeListModal from "./LikeListModal";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useSelector } from "react-redux";
import FeedContentBadgeDetails from "./FeedContentBadgeDetails";
import EmployeeName from "../../../common/EmployeeName";
import { showToast } from "../../../utilities/toast";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import ActionButton from "../../../common/ActionButton";
import Avatar from "../../../common/Avatar";
import { Heart, MessageCircle, Send, Smile } from "lucide-react";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import Loading from "../../../utilities/Loading";
import { useTimeAgo } from "../../../utilities/hooks/useTimeAgo";

const validationSchema = Yup.object().shape({
  commentContent: Yup.string().required("Feed comment is required"),
});

const FeedContent = ({ data, index }: any) => {
  const ORG_ID: string = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const feedId = data?.feedId;
  const [likeCount, setLikeCount] = useState(data?.likeCount || 0);
  const [commentCount, setCommentCount] = useState(data?.commentCount || 0);
  const [isLike, setIsLike] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeOpen, setLikeOpen] = useState(false);
  const [likeTrigger] = useLazyGetFeedLikeQuery();
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [
    feedLikeListTrigger,
    {
      data: feedLikeList,
      error: feedLikeListError,
      isLoading: feedLikeListIsLoading,
    },
  ] = useLazyGetFeedLikeListQuery();

  const [feedComment, { isLoading: feedCommentIsLoading }] =
    useFeedCommentMutation();

  const { data: profile } = useGetProfileQuery({ ORG_ID, EMP_ID });
  const imageUrl = profile?.data?.photo;
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  useEffect(() => {
    if (data.isLike) {
      setIsLike(true);
    }
  }, [feedLikeList, EMP_ID]);

  const handleLikebuttonClick = async () => {
    try {
      if (isLike) {
        setLikeCount((prevCount: any) => prevCount - 1);
        setIsLike(false);
        await likeTrigger({
          ORG_ID,
          feedId,
          EMP_ID,
        });
      } else {
        setLikeCount((prevCount: any) => prevCount + 1);
        setIsLike(true);
        await likeTrigger({
          ORG_ID,
          feedId,
          EMP_ID,
        });
      }
    } catch (error: any) {
      showToast(
        error?.data?.message || "Failed to update like status: ",
        "error"
      );
    }
  };

  const handleCommentOpen = async () => {
    setCommentOpen(true);
  };

  const handleCommentClose = () => {
    setCommentOpen(false);
  };

  const handleLikeOpen = async () => {
    setLikeOpen(true);
    try {
      await feedLikeListTrigger({ ORG_ID, feedId }).unwrap();
    } catch (error: any) {
      showToast(error?.data?.message || "Failed to fetch like list: ", "error");
    }
  };

  const handleLikeClose = () => {
    setLikeOpen(false);
  };

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

  const domainName = `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? ":" + window.location.port : ""
  }`;

  const handleClickToCopyLink = () => {
    const linkToCopy = `${domainName}/feed/feed-link/${feedId}`;
    navigator.clipboard.writeText(linkToCopy);
    showToast("link Copied", "info");
  };

  const handleReciveSelection = (option: string) => {
    if (option === "copy") {
      handleClickToCopyLink();
    } else {
      console.log("WAZO");
    }
  };

  return (
    <div
      className="bg-white rounded-md mb-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}
    >
      <div className="flex justify-between p-3">
        <div className="flex justify-between gap-3">
          <Avatar
            image={data?.feedReceivedBy?.photo}
            size={45}
            name={data?.feedReceivedBy?.firstName}
          />
          <div className="flex flex-column items-start">
            <div className="flex items-center gap-1">
              <EmployeeName
                firstName={data?.feedReceivedBy?.firstName}
                middleName={data?.feedReceivedBy?.middleName}
                lastName={data?.feedReceivedBy?.lastName}
                empId={data?.feedReceivedBy?.employeeId}
                textColor={"!text-[#585DF9]"}
                fontWeight={"font-semibold"}
                textVarient={"!text-sm"}
              />
              {data?.feedGivenBy?.firstName ? (
                <>
                  <p className="text-sm">
                    received {data?.serviceName?.toLowerCase()}
                  </p>
                  <p className="text-sm">from</p>
                  <EmployeeName
                    firstName={data?.feedGivenBy?.firstName}
                    middleName={data?.feedGivenBy?.middleName}
                    lastName={data?.feedGivenBy?.lastName}
                    empId={data?.feedGivenBy?.employeeId}
                    textColor={"!text-[#585DF9]"}
                    fontWeight={"font-semibold"}
                    textVarient={"!text-sm"}
                  />
                </>
              ) : (
                <p className="text-sm">achieved a milestone</p>
              )}
            </div>
            <p className="text-[#878791] font-normal text-sm">
              {useTimeAgo(data.createdAt)}
            </p>
          </div>
        </div>
        <ActionButton
          options={[
            {
              value: "copy",
              label: "Copy Link",
            },
          ]}
          defaultOption="Type"
          onSelect={(option) => handleReciveSelection(option)}
        />
      </div>
      <div className="w-100">
        <div className="pb-3">
          <FeedContentBadgeDetails details={data} type="feedContent" />
        </div>

        <div className="flex justify-between border-t-1 border-[#E8E8EC] p-3">
          <div className="flex items-center gap-2">
            <button
              id={index === 0 ? "feed_like_button" : ""}
              onClick={handleLikebuttonClick}
            >
              {isLike ? (
                <Heart className="w-5 h-5" fill="#FF2C55" color="#FF2C55" />
              ) : (
                <Heart className="w-5 h-5" />
              )}
            </button>
            <button
              disabled={likeCount == 0 ? true : false}
              onClick={handleLikeOpen}
              className="text-sm"
              id={index === 0 ? "feed_like_modal" : ""}
            >
              {likeCount == 0 ? "" : likeCount} Likes
            </button>
          </div>
          {commentCount !== 0 && (
            <div
              className="flex items-center gap-2"
              onClick={handleCommentOpen}
            >
              <button>
                <MessageCircle className="w-5 h-5" />
              </button>
              <button disabled={commentCount === 0}>
                {commentCount == 0 ? "" : commentCount} Comments
              </button>
            </div>
          )}
        </div>
      </div>
      <ErrorBoundary fallback={<ErrorFallback />}>
        {commentOpen && (
          <CommentListModal
            feedData={data}
            close={handleCommentClose}
            open={commentOpen}
            feedId={feedId}
            ORG_ID={ORG_ID}
            EMP_ID={EMP_ID}
            formik={formik}
            likeCount={likeCount}
            commentCount={commentCount}
            setCommentCount={setCommentCount}
          />
        )}
      </ErrorBoundary>
      <ErrorBoundary fallback={<ErrorFallback />}>
        {likeOpen && (
          <LikeListModal
            open={likeOpen}
            feedData={data}
            onClose={handleLikeClose}
            feedLikes={feedLikeList?.data}
            isLoading={feedLikeListIsLoading}
            feedLikeListError={feedLikeListError}
          />
        )}
      </ErrorBoundary>

      <div className="relative">
        <form className="flex gap-2 px-3 pb-3" onSubmit={formik.handleSubmit}>
          <div>
            <Avatar image={imageWithTimestamp} name="Profile Image" size={45} />
          </div>
          <div className="px-3 w-full flex items-center border-1 border-[#E8E8EC] rounded-full">
            <input
              name="commentContent"
              className="w-full focus-visible:outline-none"
              placeholder="Add a comment..."
              value={formik.values.commentContent}
              onChange={formik.handleChange}
            />
            <div className="flex gap-3">
              <div
                onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
              >
                <Smile className="text-[#fbbb12] w-5 h-5" />
              </div>
              <button
                type="submit"
                disabled={
                  feedCommentIsLoading || !formik.values.commentContent.trim()
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
          <div ref={emojiPickerRef} className="absolute top-[-455px] right-5">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedContent;
