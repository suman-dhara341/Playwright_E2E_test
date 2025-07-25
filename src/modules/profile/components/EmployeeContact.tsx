import React from 'react'
import { useGetContactListQuery } from '../queries/profileQuery';
// import { useFormik } from 'formik';
// import { showToast } from '../../../utilities/toast';

const EmployeeContact: React.FC<{
    EMP_ID: string;
    ORG_ID: string;
  }> = ({EMP_ID, ORG_ID}) => {
    const {
        data: employeeContactList,
        // isError: employeeContactListIsError,
        // isLoading: employeeContactListIsLoading,
        // refetch: employeeContactListRefetch,
      } = useGetContactListQuery({ ORG_ID, EMP_ID });

      console.log(employeeContactList,"employeeContactList")

    //   const formikContact = useFormik({
    //     initialValues: {
    //       contacts:
    //         employeeContactList?.data?.map((contact: any) => ({
    //           type: contact.type || '',
    //           value: contact.value || '',
    //           use: contact.use || 'Primary',
    //         })) || [{ type: '', value: '', use: 'Primary' }],
    //     },
    //     onSubmit: async (values, { resetForm }) => {
    //       try {
    //         const { message } = await updateEmployeeContact({
    //           ORG_ID,
    //           EMP_ID,
    //           Contact_ID,
    //           updateEmployeeContact: values,
    //         }).unwrap();
    //         resetForm();
    //         showToast(message, 'success');
    //       } catch (error: any) {
    //         showToast(error?.data?.message || 'Something went wrong', 'error');
    //       }
    //     },
    //   });
  return (
    <div>EmployeeContact</div>
  )
}

export default EmployeeContact