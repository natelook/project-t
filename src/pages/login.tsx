import { Layout } from '@components/common';
import { Button, Input } from '@components/ui';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const login = (e: FormEvent) => {
    e.preventDefault();
    signIn('email', { email });
  };
  return (
    <div className="max-w-md mx-auto mt-24">
      <div className=" p-10 rounded-log shadow-gray-700">
        <h1 className="text-3xl font-bold mb-5">Login</h1>

        <form onSubmit={login} className="space-y-3">
          <Input
            value={email}
            label="Email"
            name="email"
            hideLabel
            onChange={(value) => setEmail(value)}
          />
          <Button type="submit" label="Sign In">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}

LoginPage.Layout = Layout;
