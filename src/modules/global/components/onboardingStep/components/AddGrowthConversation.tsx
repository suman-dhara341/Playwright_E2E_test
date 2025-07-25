import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateEmployeeConversationMutation } from "../../../../growth/queries/growthQuery";
import { showToast } from "../../../../../utilities/toast";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../../../../profile/queries/profileQuery";
import Loading from "../../../../../utilities/Loading";
import Error from "../../../../../utilities/Error";
import ThreeDotsLoading from "../../../../../utilities/ThreeDotsLoading";

interface ConversationFormValues {
  conversationTitle: string;
  description: string;
  growthAreas: string;
}

const validationSchema = Yup.object({
  conversationTitle: Yup.string()
    .required("Title is required")
    .max(100, "Title must be at most 100 characters")
    .test(
      "no-extra-spaces",
      "Title cannot have leading, trailing, or multiple spaces",
      value =>
        !!value &&
        value.trim() === value &&
        !/\s{2,}/.test(value)
    ),

  description: Yup.string()
    .required("Description is required")
    .max(300, "Description must be at most 300 characters")
    .test(
      "no-extra-spaces",
      "Description cannot have leading, trailing, or multiple spaces",
      value =>
        !!value &&
        value.trim() === value &&
        !/\s{2,}/.test(value)
    ),
  growthAreas: Yup.string().required("Growth area is required"),
});

const growthAreaOptions = [
  "Technical or Functional expertise",
  "Strategic, Cognitive, or Tactical skills",
  "Leadership, Management, or Interpersonal skills",
  "Pursue a Degree or Certifications",
  "Expand scope, complexity, or impact of my current role",
  "Move to a new project, department, team, or role",
];

const AddGrowthConversation = ({ nextStep, prevStep, skipStep }: any) => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const {
    data: profile,
    isLoading: profileIsLoading,
    isError: profileIsError,
  } = useGetProfileQuery({ ORG_ID, EMP_ID });
  const MANAGER_ID = profile?.data?.reportsTo;
  const [createConversation, { isLoading }] =
    useCreateEmployeeConversationMutation();
  const formik = useFormik<ConversationFormValues>({
    initialValues: {
      conversationTitle: "",
      description: "",
      growthAreas: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createConversation({
          ORG_ID: ORG_ID,
          EMP_ID: EMP_ID,
          conversationDetails: {
            employeeId: EMP_ID,
            managerId: MANAGER_ID ? MANAGER_ID : "",
            conversationTitle: values.conversationTitle,
            conversationInfo: {
              description: values.description,
              growthAreas: [values.growthAreas],
            },
          },
        }).unwrap();
        resetForm();
        showToast("Conversation created successfully", "success");
        nextStep();
      } catch (err) {
        showToast("Failed to create conversation", "error");
      }
    },
  });

  const handleNextClick = async () => {
    const isValid = await formik.validateForm();
    formik.setTouched({
      conversationTitle: true,
      description: true,
      growthAreas: true,
    });

    if (Object.keys(isValid).length === 0) {
      await formik.submitForm();
      nextStep();
    }
  };

  // const handleNextClick = async () => {
  //   await formik.submitForm();
  //   nextStep();
  // };

  const handleBackClick = () => {
    prevStep();
  };

  const handleSkipClick = () => {
    skipStep();
  };

  if (profileIsLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (profileIsError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 font-semibold text-xl text-[#585DF9]">
        Initiate your first growth conversation with your manager
      </p>
      <div>
        <form onSubmit={formik.handleSubmit} className="bg-white w-full">
          <div className="mb-3">
            <label className="block text-[#73737D] text-base font-semibold">
              Growth Area
            </label>
            <p className="text-[#878791] text-xs">Select one option</p>
            <select
              name="growthAreas"
              value={formik.values.growthAreas}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
            >
              <option value="">Select a growth area</option>
              {growthAreaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formik.touched.growthAreas && formik.errors.growthAreas && (
              <p className="text-sm text-red-500 mt-1">
                {formik.errors.growthAreas}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-[#73737D] text-base font-semibold">
              Title
            </label>
            <p className="text-[#878791] text-xs">
              Character Limit: Max 100 characters
            </p>
            <input
              type="text"
              name="conversationTitle"
              value={formik.values.conversationTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 h-[40px] border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
            />
            {formik.touched.conversationTitle &&
              formik.errors.conversationTitle && (
                <p className="text-red-500 text-sm">
                  {formik.errors.conversationTitle}
                </p>
              )}
          </div>

          <div className="mb-3">
            <label className="block text-[#73737D] text-base font-semibold">
              Conversation Agenda
            </label>
            <p className="text-[#878791] text-xs">
              Character Limit: Max 300 characters
            </p>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className="w-full p-2 border border-[#E8E8EC] rounded-md mt-2 min-h-[75px] focus-visible:outline-none"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {formik.errors.description}
              </p>
            )}
          </div>
        </form>
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkipClick}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Next
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
          >
            {isLoading ? <ThreeDotsLoading color="white" /> : "Create Conversation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGrowthConversation;
