import { Layout } from '@components/common';
import { Button, Input } from '@components/ui';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { ILogin, loginSchema } from '@server/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
  const { register, handleSubmit } = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
  });

  const login = ({ email, password }: ILogin) => {
    signIn('credentials', { email, password, callbackUrl: '/profile' });
  };

  return (
    <div className="max-w-md mx-auto mt-24">
      <div className=" p-10 rounded-log shadow-gray-700">
        <h1 className="text-3xl font-bold mb-5">Login</h1>

        <form onSubmit={handleSubmit(login)} className="space-y-3">
          <Input label="Email" name="email" hideLabel register={register} />
          <Input
            label="Password"
            name="password"
            type="password"
            hideLabel
            register={register}
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
