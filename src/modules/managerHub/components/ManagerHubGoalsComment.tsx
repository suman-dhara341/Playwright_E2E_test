import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  useGetGoalsCommentsListQuery,
  useCreateEmployeeGoalsCommentMutation,
  useUpdateEmployeeGoalsCommentMutation,
  useDeleteGoalsCommentMutation,
} from "../../goals/queries/okrQuery";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../goals/css/okr.css";
import { showToast } from "../../../utilities/toast";

const validationSchema = yup.object().shape({
  commentMessage: yup.string().required("Comment is required"),
});

const ManagerHubGoalsComment = ({ GOAL_ID, TASK_ID }: any) => {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const {
    data: employeeGoalsCommentData,
    isLoading,
    isError,
    refetch,
  } = useGetGoalsCommentsListQuery(
    { EMP_ID, ORG_ID, GOAL_ID, TASK_ID },
    {
      skip: !TASK_ID,
    }
  );

  const [createComment, { isLoading: isCreating }] =
    useCreateEmployeeGoalsCommentMutation();
  const [updateComment, { isLoading: isUpdating }] =
    useUpdateEmployeeGoalsCommentMutation();
  const [triggerDeleteComment] = useDeleteGoalsCommentMutation();

  const formik = useFormik({
    initialValues: {
      commentMessage: "",
      commentedBy: EMP_ID,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingCommentId) {
          await updateComment({
            EMP_ID,
            GOAL_ID,
            TASK_ID,
            ORG_ID,
            COMMENT_ID: editingCommentId,
            commentDetails: {
              commentMessage: values.commentMessage,
              commentsId: editingCommentId,
            },
          }).unwrap();
          setEditingCommentId(null);
          showToast("Comment updated successfully", "success");
        } else {
          await createComment({
            EMP_ID,
            GOAL_ID,
            TASK_ID,
            ORG_ID,
            commentDetails: {
              commentMessage: values.commentMessage,
              commentedBy: EMP_ID,
            },
          }).unwrap();
          showToast("Comment created successfully", "success");
        }

        resetForm();
        refetch();
      } catch (err: any) {
        showToast(err?.data?.message || "Comment mutation failed", "error");
      }
    },
  });

  const handleEdit = async (comment: any) => {
    formik.setValues({
      commentMessage: comment.commentMessage,
      commentedBy: EMP_ID,
    });
    setEditingCommentId(comment.commentsId);
  };

  const handleDelete = async (commentsId: string) => {
    try {
      setDeletingCommentId(commentsId);
      await triggerDeleteComment({
        ORG_ID,
        EMP_ID,
        GOAL_ID,
        TASK_ID,
        COMMENT_ID: commentsId,
      }).unwrap();
      refetch();
      showToast("Comment deleted successfully", "success");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete comment", "error");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const comments = employeeGoalsCommentData?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[30vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md space-y-6">
      <form onSubmit={formik.handleSubmit} className="mb-3">
        <div className="h-[170px] overflow-hidden">
          <ReactQuill
            theme="snow"
            value={formik.values.commentMessage}
            onChange={(value) => formik.setFieldValue("commentMessage", value)}
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ size: [] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [
                  { list: "ordered" },
                  { list: "bullet" },
                  { indent: "-1" },
                  { indent: "+1" },
                ],
                ["link"],
              ],
            }}
          />
          {formik.touched.commentMessage && formik.errors.commentMessage && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.commentMessage}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="flex justify-center text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
          >
            {isCreating || isUpdating
              ? "Processing..."
              : editingCommentId
              ? "Update"
              : "Post"}
          </button>
        </div>
      </form>

      <div className="space-y-3 h-[55vh] overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((comment: any) => (
            <div
              key={comment.commentsId}
              className="border border-gray-200 rounded-md relative overflow-hidden"
            >
              <div className="bg-gray-50 flex justify-between items-center border-b-1 border-[#E8E8EC] p-2 overflow-hidden">
                <div className="text-sm text-[#73737D]">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="flex items-center gap-1 text-[#73737D]"
                  >
                    <Pencil className="w-3 h-3" />
                    <p>
                      {" "}
                      {editingCommentId === comment.commentsId
                        ? "Editing..."
                        : "Edit"}
                    </p>
                  </button>
                  <button
                    onClick={() => handleDelete(comment.commentsId)}
                    className="flex items-center gap-1 text-[#73737D]"
                  >
                    <Trash className="w-3 h-3" />
                    <p>
                      {" "}
                      {deletingCommentId === comment.commentsId
                        ? "Deleting..."
                        : "Delete"}
                    </p>
                  </button>
                </div>
              </div>
              <div
                className="bg-gray-50 py-3 px-2"
                dangerouslySetInnerHTML={{ __html: comment.commentMessage }}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-[#73737D]">No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default ManagerHubGoalsComment;
