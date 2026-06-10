import { useCallback, useMemo, useState } from 'react';
import type {
  LoginFormErrors,
  LoginFormValues,
  UseLoginFormOptions,
  UseLoginFormReturn,
} from './types';
import { hasFormErrors, validateEmail, validatePassword, validateLoginForm } from './validation';

const DEFAULT_VALUES: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export function useLoginForm(options: UseLoginFormOptions = {}): UseLoginFormReturn {
  const { onSubmit, initialValues } = options;

  const [values, setValues] = useState<LoginFormValues>({
    ...DEFAULT_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof LoginFormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: 'email' | 'password', value: string): string | undefined => {
    if (field === 'email') {
      return validateEmail(value);
    }
    return validatePassword(value);
  }, []);

  const handleChange = useCallback(
    (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        const fieldError = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
      }
    },
    [touched, validateField],
  );

  const handleRememberMeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, rememberMe: e.target.checked }));
  }, []);

  const handleBlur = useCallback(
    (field: 'email' | 'password') => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldError = validateField(field, values[field]);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    },
    [values, validateField],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const allTouched: Partial<Record<keyof LoginFormValues, boolean>> = {
        email: true,
        password: true,
      };
      setTouched(allTouched);

      const formErrors = validateLoginForm(values);
      setErrors(formErrors);

      if (hasFormErrors(formErrors)) {
        return;
      }

      if (!onSubmit) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit({
          email: values.email.trim(),
          password: values.password,
          rememberMe: values.rememberMe,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit],
  );

  const isValid = useMemo(() => !hasFormErrors(validateLoginForm(values)), [values]);

  const getFieldError = useCallback(
    (field: 'email' | 'password'): string | undefined => {
      return touched[field] ? errors[field] : undefined;
    },
    [errors, touched],
  );

  const getFieldDescribedBy = useCallback(
    (field: 'email' | 'password'): string | undefined => {
      const ids: string[] = [`${field}-hint`];
      const fieldError = getFieldError(field);
      if (fieldError) {
        ids.push(`${field}-error`);
      }
      return ids.join(' ');
    },
    [getFieldError],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleRememberMeChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    getFieldDescribedBy,
  };
}
