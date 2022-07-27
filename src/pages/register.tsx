import { Layout } from '@components/common';
import { Button, Input } from '@components/ui';
import { useForm } from 'react-hook-form';
import { ISignUp, signUpSchema } from '@server/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@lib/trpc';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

interface ISignUpConfirmPassword extends ISignUp {
  confirmPassword: string;
}

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ISignUpConfirmPassword>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutateAsync } = trpc.useMutation(['signUp']);

  const signUp = useCallback(
    async ({
      email,
      password,
      confirmPassword,
      username,
    }: ISignUpConfirmPassword) => {
      // if (password !== confirmPassword) {
      //   throw new Error('Passwords do not match');
      // }
      const result = await mutateAsync({ email, password, username });
      if (result.status === 201) {
        router.push('/profile');
      }
    },
    [mutateAsync, router],
  );

  return (
    <div className="max-w-md mx-auto mt-24">
      <div className=" p-10 rounded-log shadow-gray-700">
        <h1 className="text-3xl font-bold mb-5">Login</h1>

        <form onSubmit={handleSubmit(signUp)} className="space-y-3">
          <Input label="Email" name="email" hideLabel register={register} />
          <Input
            label="Password"
            name="password"
            type="password"
            hideLabel
            register={register}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            hideLabel
            register={register}
          />
          <Input
            label="Username"
            name="username"
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

Register.Layout = Layout;
