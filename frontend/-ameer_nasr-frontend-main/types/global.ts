export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IBaseResponse<T = void> {
  success: boolean;
  statusCode: number;
  message: string;
  IMeta?: IMeta;
  data?: T;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

// How It Works Card Props === HOMEPAGE

export interface HowItWorksCardProps {
  serial: number;
  title: string;
  subtitle: string;
  titleColor?: string;
  sectionBg?: string;
}

// Icon section type
export interface iconArrType {
  id: number;
  icon: string;
  title: string;
}

// auth flow types

// Login Types
export interface ILoginPayload {
  email: string;
  password: string;
}

export type ILoginResponse = IBaseResponse<{ token: string }>;

// ===================
// Password Change Types

// Forgot types
export interface IForgotPasswordPayload {
  email: string;
}
export type IForgotPasswordResponse = IBaseResponse;

// Resend OTP
export interface IResendOTPReqBody {
  email: string;
}
// export interface IResendOTPBaseResponse {
//   success: boolean;
//   statusCode: number;
//   message: string;
// }
export type IResendOTPBaseResponse = IBaseResponse;

// Reset Password
export interface IResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export type IResetPasswordResponse = IBaseResponse;

// Verify OTP type
export interface IVerifyOTPPayload {
  email: string;
  otp: string;
}

export type IVerifyOTPResponse = IBaseResponse<{ message: string }>;

// Profile Update Types
export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  isTwoFactorEnabled?: boolean;
  chatSessionId?:string;
  lastPlanId?:string;
}

export type IUpdateProfileResponse = IBaseResponse;

// User type

export interface IUserData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  profileUrl: string | null;
  stripeCustomerId?: string | null;
  hasActiveSubscription: boolean;
  otp?: string | null;
  otpExpiresAt?: string | null;
  isTwoFactorEnabled: boolean;
  role: "super_admin" | "admin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  chatSessionId:string;
  lastPlanId:string;
}

export type IUserResponse = IBaseResponse<IUserData>;



//all user data

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  profileUrl: string | null;
  stripeCustomerId: string | null;
  hasActiveSubscription: boolean;
  otp: number | null;
  otpExpiresAt: string | null;
  isTwoFactorEnabled: boolean;
  password: string;
  role: "user" | "admin" | "super_admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  type:string
}
export interface MetaData {
  page: number;
  limit: number;
  total: number;
}
export interface UsersData {
  meta: MetaData;
  data: User[];
}
export interface UsersResponse {
  success: boolean;
  message: string;
  data: UsersData;
}

//payment




// User object
export interface UserforPayment {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string | null;
  profileUrl: string | null;
  stripeCustomerId: string;
  hasActiveSubscription: boolean;
  otp: string | null;
  otpExpiresAt: string | null;
  isTwoFactorEnabled: boolean;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Plan object
export interface Plan {
  id: string;
  name: string;
  stripePriceId: string;
  stripeProductId: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features: string[];
}

// Payment object
export interface Payment {
  id: string;
  amount: number;
  paymentMethodId: string;
  previousPlanId: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  endDate: string | null;
  refundedAmount: number | null;
  subscriptionId: string;
  userId: string;
  planId: string;
  stripePriceId: string;
  stripeProductId: string;
  user: UserforPayment;
  plan: Plan;
}

// Pagination meta
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Data object
export interface PaymentData {
  meta: Meta;
  data: Payment[];
}

// API response
export interface PaymentApiResponse {
  success: boolean;
  message: string;
  data: PaymentData;
}



//get all news

export interface NewsUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string | null;
  profileUrl: string;
  stripeCustomerId: string | null;
  hasActiveSubscription: boolean;
  otp: number | null;
  otpExpiresAt: string | null;
  isTwoFactorEnabled: boolean;
  password: string;
  role: "user" | "super_admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  thumbUrl: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: NewsUser;
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: NewsItem[];
}


//single job type
export interface SingleJob {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string | null;
  profileUrl: string;
  stripeCustomerId: string | null;
  hasActiveSubscription: boolean;
  otp: string | null;
  otpExpiresAt: string | null;
  isTwoFactorEnabled: boolean;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface news {
  id: string;
  title: string;
  thumbUrl: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: SingleJob;
}

export interface SingleJobResponse {
  success: boolean;
  message: string;
  data: news;
}


//feedback

export interface IFeedbackResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    comment: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
  errorSources?: string[];

}



//get all plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  stripePriceId: string;
  stripeProductId: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  isActive: boolean;
  createdAt: string;   // or Date if you convert it
  updatedAt: string;   // or Date if you convert it
  features: string[];
}

export interface SubscriptionPlansResponse {
  success: boolean;
  message: string;
  data: SubscriptionPlan[];
}




