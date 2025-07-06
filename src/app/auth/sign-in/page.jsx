// src/app/auth/sign-in/page.jsx
import { Suspense } from 'react';
import SignInClient from './SignInClient';

export default function SignInPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SignInClient />
    </Suspense>
  );
}