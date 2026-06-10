export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface LoginFormState {
  values: LoginFormValues;
  errors: LoginFormErrors;
  touched: Partial<Record<keyof LoginFormValues, boolean>>;
  isSubmitting: boolean;
}

export interface LoginPageProps {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  title?: string;
  subtitle?: string;
  brandName?: string;
}

export interface UseLoginFormOptions {
  onSubmit?: (values: LoginFormValues) => Promise<void> | void;
  initialValues?: Partial<LoginFormValues>;
}

export interface UseLoginFormReturn {
  values: LoginFormValues;
  errors: LoginFormErrors;
  touched: Partial<Record<keyof LoginFormValues, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRememberMeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: 'email' | 'password') => () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  getFieldError: (field: 'email' | 'password') => string | undefined;
  getFieldDescribedBy: (field: 'email' | 'password') => string | undefined;
}
