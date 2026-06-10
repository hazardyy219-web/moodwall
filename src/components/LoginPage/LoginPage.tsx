import { useRef, useEffect, useState } from 'react';
import { useLoginForm } from './useLoginForm';
import { useShakeOnError } from './useShakeOnError';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import type { LoginPageProps } from './types';
import {
  BrandLogo,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  ErrorIcon,
  GoogleIcon,
  GitHubIcon,
} from './Icons';
import styles from './LoginPage.module.css';

export function LoginPage({
  onSubmit,
  title = 'Welcome back',
  subtitle = 'Sign in to continue to your workspace',
  brandName = 'Apex',
}: LoginPageProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    isSubmitting,
    handleChange,
    handleRememberMeChange,
    handleBlur,
    handleSubmit,
    getFieldError,
    getFieldDescribedBy,
  } = useLoginForm({ onSubmit });

  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');
  const emailShaking = useShakeOnError(emailError);
  const passwordShaking = useShakeOnError(passwordError);

  const formErrorCount = [emailError, passwordError].filter(Boolean).length;
  const statusMessage =
    formErrorCount > 0
      ? `Form has ${formErrorCount} error${formErrorCount > 1 ? 's' : ''}. Please review the fields below.`
      : '';

  const emailActive = values.email.length > 0;
  const passwordActive = values.password.length > 0;

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  return (
    <main className={styles.page} id="main-content">
      <div className={styles.pageInner}>
        <ThemeToggle className={styles.themeTogglePosition} />

        <div className={styles.card}>
          <header className={styles.brand}>
            <div className={styles.logoWrap}>
              <BrandLogo />
            </div>
            <p className={styles.brandName}>{brandName}</p>
            <h1 id="login-title" className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </header>

          <div
            className={styles.statusRegion}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {statusMessage}
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
            aria-labelledby="login-title"
          >
            <div className={styles.field}>
              <div
                className={`${styles.inputGroup} ${emailError ? styles.inputGroupError : ''} ${emailShaking ? styles.inputGroupShake : ''}`}
              >
                <label
                  htmlFor="email"
                  className={`${styles.floatingLabel} ${emailActive ? styles.floatingLabelActive : ''}`}
                >
                  Email address
                  <span className={styles.statusRegion}> (required)</span>
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={emailError ? 'true' : 'false'}
                  aria-describedby={getFieldDescribedBy('email')}
                  disabled={isSubmitting}
                />
                <span className={styles.inputBorder} aria-hidden="true" />
                <span className={styles.inputBorderFill} aria-hidden="true" />
              </div>
              <span id="email-hint" className={styles.hint}>
                Use your registered email address
              </span>
              {emailError && (
                <span id="email-error" className={styles.error} role="alert">
                  <ErrorIcon className={styles.errorIcon} />
                  {emailError}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <div
                className={`${styles.inputGroup} ${passwordError ? styles.inputGroupError : ''} ${passwordShaking ? styles.inputGroupShake : ''}`}
              >
                <label
                  htmlFor="password"
                  className={`${styles.floatingLabel} ${passwordActive ? styles.floatingLabelActive : ''}`}
                >
                  Password
                  <span className={styles.statusRegion}> (required)</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithToggle}`}
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  autoComplete="current-password"
                  required
                  aria-required="true"
                  aria-invalid={passwordError ? 'true' : 'false'}
                  aria-describedby={getFieldDescribedBy('password')}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOffIcon className={styles.toggleIcon} />
                  ) : (
                    <EyeIcon className={styles.toggleIcon} />
                  )}
                </button>
                <span className={styles.inputBorder} aria-hidden="true" />
                <span className={styles.inputBorderFill} aria-hidden="true" />
              </div>
              <span id="password-hint" className={styles.hint}>
                Minimum 8 characters
              </span>
              {passwordError && (
                <span id="password-error" className={styles.error} role="alert">
                  <ErrorIcon className={styles.errorIcon} />
                  {passwordError}
                </span>
              )}
            </div>

            <div className={styles.formRow}>
              <label className={styles.rememberMe} id="remember-me-label">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  className={styles.rememberCheckbox}
                  checked={values.rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={isSubmitting}
                />
                <span className={styles.rememberVisual} aria-hidden="true">
                  {values.rememberMe && <CheckIcon className={styles.rememberCheckIcon} />}
                </span>
                <span className={styles.rememberLabel}>Remember me</span>
              </label>
              <a href="#forgot-password" className={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`${styles.submit} ${isSubmitting ? styles.submitLoading : ''}`}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <span className={styles.spinner} aria-hidden="true" />}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerLine} aria-hidden="true" />
              <span className={styles.dividerText}>or continue with</span>
              <span className={styles.dividerLine} aria-hidden="true" />
            </div>

            <div className={styles.socialRow}>
              <button
                type="button"
                className={styles.socialBtn}
                aria-label="Sign in with Google"
                disabled={isSubmitting}
              >
                <GoogleIcon className={styles.socialIcon} />
              </button>
              <button
                type="button"
                className={styles.socialBtn}
                aria-label="Sign in with GitHub"
                disabled={isSubmitting}
              >
                <GitHubIcon className={styles.socialIcon} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
