import { useFormik } from "formik";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { showToast } from "../../../utilities/toast";
import { AwardRequestPendingItem } from "../interfaces";
import { useAwardRequestRejectMutation } from "../queries/awardQuery";
import { useSelector } from "react-redux";
import { Modal } from "@mui/material";

const AcceptRequestDialog = ({
  request,
  onClose,
  onAccept,
  loadingRequests,
  refetch,
}: {
  request: AwardRequestPendingItem;
  onClose: () => void;
  onAccept: () => void;
  loadingRequests: {
    [key: string]: boolean;
  };
  refetch: any;
}) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const awardId = request?.awardId;
  const requestId = request.requestId;
  const [awardRequestReject, { isLoading }] = useAwardRequestRejectMutation();

  const formik = useFormik({
    initialValues: {
      requestId: requestId,
      status: "rejected",
      comment: "Request rejected by Moderator",
      givenBy: EMP_ID,
      awardReceivedBy: request?.employeeDetails?.employeeId,
    },
    // validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await awardRequestReject({
          ORG_ID,
          awardId,
          requestDescription: values,
        }).unwrap();
        resetForm();
        showToast("Award request rejected successfully", "success");
        await refetch();
        onClose();
      } catch (error: any) {
        showToast(error?.data?.message || "Something went wrong", "error");
      }
    },
  });

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div
        className="bg-white p-3 rounded-md w-[600px] flex flex-col gap-6 z-[1001] max-h-[650px] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-[24px] text-[#585DF9]">Evidence</p>
          <div
            className="!text-base pl-1 request_evidence"
            dangerouslySetInnerHTML={{ __html: request.description }}
          />
        </div>
        <div className="flex flex-row  gap-2 justify-between">
          <button
            className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md !text-sm"
            onClick={onAccept}
          >
            {loadingRequests[request.awardId] ? (
              <ThreeDotsLoading color="white" />
            ) : (
              "Accept"
            )}
          </button>
          <button
            className="text-[#E33535] py-2 px-4 border-[#E33535] border-[1px] !rounded-md"
            onClick={(event) => {
              event.stopPropagation();
              formik.submitForm();
            }}
          >
            {isLoading ? <ThreeDotsLoading color="#E33535" /> : "Reject"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AcceptRequestDialog;
