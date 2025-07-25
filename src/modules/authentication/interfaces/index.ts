
export interface SignUpFormValues {
    firstName: string;
    lastName: string;
    email: string;
    companyName: string;
    password: string;
    confirmPassword: string;
}

export interface ResendFormValues {
    email: string;
}

export interface verifyFormValues {
    email: string;
    code: string;
}

export interface SignInFormValues {
    email: string;
    password: string;
    fcmToken: string;
}

export interface SignInResponse {
    accessToken: string;
}
export interface ForgotPasswordFormValues {
    email: string;
}

export interface SetNewPasswordFormValues{
    email: string;
    confirmCode: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordFormValues{
    confirmPassword?: unknown;
    accessToken: string;
    oldPassword: string;
    newPassword: string
}

export interface SetNewTempPasswordFormValues{
    email: string;
    session?: string;
    newPassword: string;
    confirmPassword: string;
}

export interface logoutPayload{
    authToken: string,
    email:string,
    fcmToken: string,
}