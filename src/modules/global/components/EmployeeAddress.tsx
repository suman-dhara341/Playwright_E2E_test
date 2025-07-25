import React, { useState } from "react";
import { EmployeeAddressData } from "../../profile/interfaces";
import {
  useCreateEmployeeAddressMutation,
  useGetEmployeeAddressQuery,
  useLazyDeleteEmployeeAddressQuery,
  useUpdateEmployeeAddressMutation,
} from "../../profile/queries/profileQuery";
import { useFormik } from "formik";
import { showToast } from "../../../utilities/toast";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import * as Yup from "yup";
import { Trash } from "lucide-react";

const validationSchema = Yup.object({
  use: Yup.string().required("Use is required"),
  text: Yup.string().required("Text is required"),
  addressLine: Yup.array()
    .of(Yup.string().trim().required("Address Line is required"))
    .min(1, "At least one Address Line is required"),
  city: Yup.string().trim().required("City is required"),
  district: Yup.string().trim().required("District is required"),
  state: Yup.string().trim().required("State is required"),
  postalCode: Yup.string()
    .trim()
    .matches(/^\d+$/, "Postal Code must be numeric")
    .required("Postal Code is required"),
  country: Yup.string().trim().required("Country is required"),
});

const EmployeeAddress: React.FC<{
  EMP_ID: string;
  ORG_ID: string;
}> = ({ EMP_ID, ORG_ID }) => {
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null
  );
  const {
    data: employeeAddress,
    isError: employeeAddressListIsError,
    isLoading: employeeAddressListIsLoading,
    refetch: employeeAddressListRefetch,
  } = useGetEmployeeAddressQuery({ ORG_ID, EMP_ID });

  const [addressDelete] = useLazyDeleteEmployeeAddressQuery();
  const [employeeAddressUpdateCall, { isLoading: isUpdating }] =
    useUpdateEmployeeAddressMutation();
  const [employeeAddressCreateCall, { isLoading: isCreating }] =
    useCreateEmployeeAddressMutation();

  const formikAddress = useFormik({
    initialValues: {
      use: "",
      type: "",
      text: "",
      addressLine: [""],
      city: "",
      district: "",
      state: "",
      postalCode: "",
      country: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingAddressId) {
          const { message } = await employeeAddressUpdateCall({
            ORG_ID,
            EMP_ID,
            Address_ID: editingAddressId,
            updatedEmployeeAddress: values,
          }).unwrap();
          showToast(message, "success");
        } else {
          await employeeAddressCreateCall({
            ORG_ID,
            EMP_ID,
            createEmployeeAddress: values,
          }).unwrap();
          showToast("Address created successfully", "success");
        }
        resetForm();
        setEditingAddressId(null);
        setIsAdding(false);
        employeeAddressListRefetch();
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to create address", "error");
      }
    },
  });

  const handleAddNewAddress = () => {
    setIsAdding(true);
    setEditingAddressId(null);
    formikAddress.resetForm();
  };

  const handleEdit = (addressId: any) => {
    setEditingAddressId(addressId);
    setIsAdding(false);
    const address = employeeAddress?.data?.find(
      (addr: EmployeeAddressData) => addr.addressId === addressId
    );
    if (address) {
      formikAddress.setValues({
        use: address.use,
        type: address.type,
        text: address.text,
        addressLine: address.addressLine || [""],
        city: address.city,
        district: address.district,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      });
    }
  };

  const handleDelete = async (Address_ID?: string) => {
    if (!Address_ID) return;
    setDeletingAddressId(Address_ID);
    try {
      await addressDelete({ ORG_ID, EMP_ID, Address_ID }).unwrap();
      showToast("Address deleted successfully", "success");
      employeeAddressListRefetch();
    } catch (error: any) {
      showToast(error?.data?.message || "An error occurred", "error");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleAddAddressLine = () => {
    formikAddress.setFieldValue("addressLine", [
      ...formikAddress.values.addressLine,
      "",
    ]);
  };

  const handleRemoveAddressLine = (index: number) => {
    const newAddressLines = formikAddress.values.addressLine.filter(
      (_, i) => i !== index
    );
    formikAddress.setFieldValue("addressLine", newAddressLines);
  };

  if (employeeAddressListIsLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-90px)] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (employeeAddressListIsError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-90px)] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleAddNewAddress}
        className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md mb-3"
      >
        Add New Address
      </button>

      {(isAdding || editingAddressId) && (
        <form
          onSubmit={formikAddress.handleSubmit}
          className="h-[calc(100vh-315px)] overflow-y-auto pb-3 pr-1"
        >
          <div className="space-y-2">
            {/* Use Select */}
            <div>
              <label
                htmlFor="use"
                className="block text-sm font-medium text-[#73737D]"
              >
                Use
              </label>
              <select
                id="use"
                name="use"
                value={formikAddress.values.use}
                onChange={formikAddress.handleChange}
                onBlur={formikAddress.handleBlur}
                className={`mt-1 block w-full rounded-md border ${
                  formikAddress.touched.use && formikAddress.errors.use
                    ? "border-red-500"
                    : "border-gray-300"
                } w-full border p-2 rounded-md focus-visible:outline-none`}
              >
                <option value="">Select Use</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
              {formikAddress.touched.use && formikAddress.errors.use && (
                <p className="mt-1 text-sm text-red-600">
                  {formikAddress.errors.use}
                </p>
              )}
            </div>

            {/* Text Select */}
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-[#73737D]"
              >
                Text
              </label>
              <select
                id="text"
                name="text"
                value={formikAddress.values.text}
                onChange={formikAddress.handleChange}
                onBlur={formikAddress.handleBlur}
                className={`mt-1 block w-full rounded-md border ${
                  formikAddress.touched.text && formikAddress.errors.text
                    ? "border-red-500"
                    : "border-gray-300"
                } w-full border p-2 rounded-md focus-visible:outline-none`}
              >
                <option value="">Select Text</option>
                <option value="Current">Current</option>
                <option value="Present">Present</option>
              </select>
              {formikAddress.touched.text && formikAddress.errors.text && (
                <p className="mt-1 text-sm text-red-600">
                  {formikAddress.errors.text}
                </p>
              )}
            </div>

            {/* Address Lines */}
            {formikAddress.values.addressLine.map((addressLine, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <label
                    htmlFor={`addressLine[${index}]`}
                    className="block text-sm font-medium text-[#73737D]"
                  >
                    Address Line {index + 1}
                  </label>
                  <input
                    type="text"
                    id={`addressLine[${index}]`}
                    name={`addressLine[${index}]`}
                    value={addressLine}
                    onChange={formikAddress.handleChange}
                    onBlur={formikAddress.handleBlur}
                    className={`mt-1 block w-full rounded-md border ${
                      formikAddress.errors.addressLine?.[index]
                        ? "border-red-500"
                        : "border-gray-300"
                    } w-full border p-2 rounded-md focus-visible:outline-none`}
                  />
                  {formikAddress.errors.addressLine?.[index] && (
                    <p className="mt-1 text-sm text-red-600">
                      {formikAddress.errors.addressLine[index]}
                    </p>
                  )}
                </div>

                {/* Delete Button */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddressLine(index)}
                    className="mt-6 text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAddAddressLine}
            className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md mt-3 my-3"
          >
            Add Address Line
          </button>

          <div className="space-y-2">
            <div className="w-full flex gap-3">
              {/* City */}
              <div className="w-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-[#73737D]"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formikAddress.values.city}
                  onChange={formikAddress.handleChange}
                  onBlur={formikAddress.handleBlur}
                  className={`mt-1 block w-full rounded-md border ${
                    formikAddress.touched.city && formikAddress.errors.city
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full border p-2 rounded-md focus-visible:outline-none`}
                />
                {formikAddress.touched.city && formikAddress.errors.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {formikAddress.errors.city}
                  </p>
                )}
              </div>

              {/* District */}
              <div className="w-full">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-[#73737D]"
                >
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formikAddress.values.district}
                  onChange={formikAddress.handleChange}
                  onBlur={formikAddress.handleBlur}
                  className={`mt-1 block w-full rounded-md border ${
                    formikAddress.touched.district &&
                    formikAddress.errors.district
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full border p-2 rounded-md focus-visible:outline-none`}
                />
                {formikAddress.touched.district &&
                  formikAddress.errors.district && (
                    <p className="mt-1 text-sm text-red-600">
                      {formikAddress.errors.district}
                    </p>
                  )}
              </div>
            </div>

            {/* State */}
            <div className="w-full flex gap-3">
              <div className="w-full">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-[#73737D]"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formikAddress.values.state}
                  onChange={formikAddress.handleChange}
                  onBlur={formikAddress.handleBlur}
                  className={`mt-1 block w-full rounded-md border ${
                    formikAddress.touched.state && formikAddress.errors.state
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full border p-2 rounded-md focus-visible:outline-none`}
                />
                {formikAddress.touched.state && formikAddress.errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {formikAddress.errors.state}
                  </p>
                )}
              </div>

              {/* Postal Code */}
              <div className="w-full">
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium text-[#73737D]"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formikAddress.values.postalCode}
                  onChange={formikAddress.handleChange}
                  onBlur={formikAddress.handleBlur}
                  className={`mt-1 block w-full rounded-md border ${
                    formikAddress.touched.postalCode &&
                    formikAddress.errors.postalCode
                      ? "border-red-500"
                      : "border-gray-300"
                  } w-full border p-2 rounded-md focus-visible:outline-none`}
                />
                {formikAddress.touched.postalCode &&
                  formikAddress.errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {formikAddress.errors.postalCode}
                    </p>
                  )}
              </div>
            </div>
            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-[#73737D]"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formikAddress.values.country}
                onChange={formikAddress.handleChange}
                onBlur={formikAddress.handleBlur}
                className={`mt-1 block w-full rounded-md border ${
                  formikAddress.touched.country && formikAddress.errors.country
                    ? "border-red-500"
                    : "border-gray-300"
                } w-full border p-2 rounded-md focus-visible:outline-none`}
              />
              {formikAddress.touched.country &&
                formikAddress.errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {formikAddress.errors.country}
                  </p>
                )}
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
              disabled={isUpdating || isCreating}
            >
              {isUpdating || isCreating ? (
                <ThreeDotsLoading color="#585DF9" />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      )}

      {!editingAddressId && (
        <div>
          {employeeAddress?.data?.map((address: EmployeeAddressData) => (
            <div key={address.addressId} style={{ margin: "16px 0" }}>
              <div>
                {editingAddressId === address.addressId ? null : (
                  <div className="flex justify-between">
                    <div>
                      <p>Using as {address.use} Address</p>
                      <p>Address Type - {address.text}</p>
                      <p>{address.addressLine.join(", ")}</p>
                      <p>{`City - ${address.city}, State - ${address.state}, Country - ${address.country}`}</p>
                      <p>
                        District - {address.district}, PIN -{" "}
                        {address.postalCode}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md mt-3 employee_edit_btn"
                        onClick={() => handleEdit(address?.addressId)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md mt-3 employee_edit_btn"
                        onClick={() => handleDelete(address?.addressId)}
                        disabled={deletingAddressId === address.addressId}
                      >
                        {deletingAddressId === address.addressId ? (
                          <ThreeDotsLoading color="#585DF9" />
                        ) : (
                          <DeleteIcon />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default EmployeeAddress;
