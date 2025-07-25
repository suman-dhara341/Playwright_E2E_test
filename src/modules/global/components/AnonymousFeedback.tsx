import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import theme from "../css/miuiExtendTheme";
import { useSelector } from "react-redux";
import {
  useAnonymousFeedbackMutation,
  useGetAnonymousFeedbackQuery,
} from "../queries/globalQuery";
import { useState, useEffect } from "react";
import { FeedbackOption } from "../interfaces";
import { showToast } from "../../../utilities/toast";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { Info } from "lucide-react";

const AnonymousFeedback = () => {
  const Theme = theme.palette;
  const ORG_ID = useSelector(
    (state: any) => state.auth?.userData?.["custom:orgId"] || null
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth?.userData?.["custom:empId"] || null
  );
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedBack, { isLoading, isSuccess }] = useAnonymousFeedbackMutation();
  const [feedBackSubmitBtnType, setFeedBackSubmitBtnType] = useState("");
  const reportsTo = useSelector((state: any) => state.feedProfile.reportsTo);
  const DATE = new Date().toISOString().split("T")[0];

  const loadCachedFeedbackData = () => {
    const storedData = localStorage.getItem("anonymousFeedback");
    const storedDate = localStorage.getItem("feedbackCacheDate");
    const todayDate = new Date().toISOString().split("T")[0];

    if (storedDate !== todayDate) {
      localStorage.removeItem("anonymousFeedback");
      localStorage.setItem("feedbackCacheDate", todayDate);
      return null;
    }

    const parsedData = storedData ? JSON.parse(storedData) : null;
    if (parsedData?.data?.status === "responded") {
      setFeedbackSubmitted(true);
      return parsedData;
    }

    return parsedData;
  };

  const [anonymousFeedbackList, setAnonymousFeedbackList] = useState<any>(
    loadCachedFeedbackData
  );

  const { data: apiData, isLoading: anonymousFeedbackListIsLoading } =
    useGetAnonymousFeedbackQuery(
      { ORG_ID, EMP_ID, DATE },
      { skip: !!anonymousFeedbackList || feedbackSubmitted }
    );

  useEffect(() => {
    if (apiData && !anonymousFeedbackList) {
      setAnonymousFeedbackList(apiData);
      localStorage.setItem("anonymousFeedback", JSON.stringify(apiData));
      localStorage.setItem(
        "feedbackCacheDate",
        new Date().toISOString().split("T")[0]
      );

      if (apiData?.data?.status === "responded") {
        setFeedbackSubmitted(true);
      }
    }
  }, [apiData, anonymousFeedbackList]);

  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem("anonymousFeedback");
      setFeedbackSubmitted(true);
    }
  }, [isSuccess]);

  const handleSubmitFeedback = async (
    feedBackBtnType: string,
    index?: number | null
  ) => {
    setFeedBackSubmitBtnType(feedBackBtnType);

    const selectedFeedbackOption =
      anonymousFeedbackList?.data?.questionDetails?.options[index || 0];

    const currentDate = new Date().toISOString().split("T")[0];

    const feedback = {
      orgId: ORG_ID,
      feedbackDate: currentDate,
      employeeId: EMP_ID,
      managerId: reportsTo,
      relateTo: selectedFeedbackOption?.relateTo || "defaultRelateTo",
      questionsFeedback: [
        {
          questionId:
            anonymousFeedbackList?.data?.questionDetails?.questionId ||
            "defaultId",
          areaId:
            anonymousFeedbackList?.data?.questionDetails?.areaId ||
            "defaultAreaId",
          type:
            anonymousFeedbackList?.data?.questionDetails?.type ||
            "defaultParent",
          questionType:
            anonymousFeedbackList?.data?.questionDetails?.questionType ||
            "defaultSingleChoice",
          questionText:
            anonymousFeedbackList?.data?.questionDetails?.questionText ||
            "defaultText",
          options: anonymousFeedbackList?.data?.questionDetails?.options || [],
          answer: String(index),
          point: selectedFeedbackOption?.weight,
        },
      ],
    };

    try {
      await feedBack({ ORG_ID, feedback }).unwrap();
      showToast("Feedback submitted successfully", "success");
    } catch (error: any) {
      console.error("Failed to submit feedback:", error);
      showToast(error?.data?.message || "Failed to submit feedback", "error");
    }
  };

  if (anonymousFeedbackListIsLoading && !anonymousFeedbackList) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fixed w-[31%] bottom-0 right-[10px] z-[99]">
      {!feedbackSubmitted
        ? anonymousFeedbackList?.data && (
            <div
              className="bg-white rounded-t-md"
              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
            >
              <div className="flex items-center justify-between gap-1 pt-3">
                <p className="font-semibold text-lg text-[#585DF9] pl-3">
                  Today's Pulse Check
                </p>

                <div className="relative group pr-3">
                  <Info className="w-4 h-4 text-gray-500 cursor-pointer" />

                  <div className="absolute left-[-140px] top-full mt-2 hidden w-80 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm p-3 shadow-lg group-hover:block z-50">
                    Pulse is a real-time, company-wide tool created to genuinely
                    listen to employees, gather signals, and learn from their
                    experiences, and surface obstacles early, to help strengthen
                    the employee experience and culture before small issues
                    become bigger acute problems. All responses you provide are
                    anonymous and just an aggregated view is shared.
                    <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </div>

              <div className="px-3 pb-3">
                <div className="mt-3">
                  <p className="font-semibold text-base mb-2">
                    Question:{" "}
                    <span className="font-normal">
                      {
                        anonymousFeedbackList?.data?.questionDetails
                          ?.questionText
                      }
                    </span>
                  </p>
                  <p className="text-[#73737D] font-normal text-base mb-2">
                    (Select the option that best applies to you)
                  </p>
                </div>
                <RadioGroup
                  className="option_text !text-base"
                  aria-labelledby="question-rating"
                  name="feedback-options"
                  value={
                    selectedOptionIndex !== null
                      ? anonymousFeedbackList?.data?.questionDetails?.options[
                          selectedOptionIndex
                        ]?.optionText
                      : ""
                  }
                  onChange={(e) => {
                    const index =
                      anonymousFeedbackList?.data?.questionDetails?.options.findIndex(
                        (option: FeedbackOption) =>
                          option.optionText === e.target.value
                      );
                    setSelectedOptionIndex(index);
                  }}
                >
                  {anonymousFeedbackList?.data?.questionDetails?.options
                    ?.filter(
                      (option: FeedbackOption) =>
                        option.optionText !== "I would rather not answer"
                    )
                    .map((option: FeedbackOption, index: number) => (
                      <FormControlLabel
                        key={index}
                        value={option.optionText}
                        control={
                          <Radio
                            sx={{
                              color: Theme.primary.contrastText,
                              "&.Mui-checked": {
                                color: Theme.secondary.main,
                              },
                            }}
                          />
                        }
                        label={option.optionText}
                      />
                    ))}
                </RadioGroup>
                <div className="flex justify-between mt-3">
                  {anonymousFeedbackList?.data?.questionDetails?.options?.some(
                    (option: FeedbackOption) =>
                      option.optionText === "I would rather not answer"
                  ) && (
                    <button
                      className="flex justify-center text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px]"
                      onClick={() => {
                        const optionIndex =
                          anonymousFeedbackList?.data?.questionDetails?.options.findIndex(
                            (option: FeedbackOption) =>
                              option.optionText === "I would rather not answer"
                          );
                        if (optionIndex !== -1) {
                          setSelectedOptionIndex(optionIndex);
                          handleSubmitFeedback("notToAnswer", optionIndex);
                        }
                      }}
                      disabled={
                        isLoading && feedBackSubmitBtnType === "notToAnswer"
                      }
                    >
                      {isLoading && feedBackSubmitBtnType === "notToAnswer" ? (
                        <ThreeDotsLoading color="white" />
                      ) : (
                        "I prefer not to answer"
                      )}
                    </button>
                  )}
                  <button
                    className="flex justify-center text-sm text-white text-center bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px]"
                    onClick={() =>
                      handleSubmitFeedback(
                        "selectedAnswer",
                        selectedOptionIndex
                      )
                    }
                    disabled={
                      (isLoading || selectedOptionIndex === null) &&
                      feedBackSubmitBtnType === "selectedAnswer"
                    }
                  >
                    {isLoading && feedBackSubmitBtnType === "selectedAnswer" ? (
                      <ThreeDotsLoading color="white" />
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        : null}
    </div>
  );
};

export default AnonymousFeedback;
