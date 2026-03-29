import { SignIn } from '@/src/lib/auth/clerk-wrapper';

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0F1117',
      }}
    >
      <SignIn />
    </div>
  );
}
