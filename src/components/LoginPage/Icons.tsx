import styles from './LoginPage.module.css';

interface IconProps {
  className?: string;
}

export function BrandLogo({ className }: IconProps) {
  return (
    <svg
      className={className ?? styles.logoIcon}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="36" height="36" rx="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 26L20 14L28 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="14" r="2" fill="currentColor" />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M21 14.5A8.5 8.5 0 1111.5 4a6.5 6.5 0 0010 10.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function EyeOffIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.09A10.94 10.94 0 0112 5c6 0 10 7 10 7a18.45 18.45 0 01-5.06 5.94M6.1 6.1C3.68 7.87 2 12 2 12a18.5 18.5 0 005.66 5.66"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M5 12l4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ErrorIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M22 12.24c0-.82-.07-1.64-.22-2.43H12v4.59h5.68a5.18 5.18 0 01-2.25 3.4v2.82h3.64c2.13-1.97 3.33-4.86 3.33-8.24z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 23c3.04 0 5.58-1 7.43-2.72l-3.64-2.82c-1.01.68-2.31 1.08-3.79 1.08-2.91 0-5.37-1.96-6.25-4.61H1.3v2.9A11 11 0 0012 23z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M5.75 14.59A6.6 6.6 0 015.4 12c0-.9.16-1.77.44-2.59V8.01H1.3A11 11 0 000 12c0 1.77.42 3.45 1.3 4.99l4.45-3.4z"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M12 4.73c1.66 0 3.14.57 4.3 1.68l3.22-3.22A10.9 10.9 0 0012 1C7.3 1 3.16 3.47 1.3 8.01l4.45 3.4C6.63 6.73 9.13 4.73 12 4.73z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.5v-1.74c-2.78.62-3.37-1.35-3.37-1.35-.45-1.18-1.1-1.5-1.1-1.5-.9-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.55 2.36 1.1 2.94.84.09-.66.35-1.1.63-1.35-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.38-2.03 1.01-2.75-.1-.26-.44-1.32.1-2.74 0 0 .83-.27 2.75 1.02A9.3 9.3 0 0112 5.8c1.66 0 3.28.45 4.75 1.31 1.92-1.29 2.75-1.02 2.75-1.02.55 1.42.2 2.48.1 2.74.63.72 1.01 1.63 1.01 2.75 0 3.94-2.27 4.8-4.51 5.06.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.04 10.04 0 0022 12.26C22 6.58 17.52 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
