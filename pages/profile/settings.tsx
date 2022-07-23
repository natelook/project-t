import { Heading, Layout } from '@components/common';
import { Button, Input } from '@components/ui';
import { useForm } from 'react-hook-form';

export default function ProfileSettingsPage() {
  const { register, handleSubmit } = useForm();
  const addSteam = async () => {};
  return (
    <div>
      <Heading name="Profile Settings" />
      <h2 className="text-2xl">Connect Accounts</h2>
      <form onSubmit={handleSubmit(addSteam)} className="max-w-lg space-y-3">
        <div>
          <Input name="steam" label="Steam Profile" />
          <span className="text-xs text-gray-400 block uppercase">
            Get the correct Steam Profile ID{' '}
            <a
              href=""
              rel="noreferer"
              target="_blank"
              className="text-primary-lighter font-bold"
            >
              here
            </a>
            .
          </span>
        </div>
        <Button label="Add steam profile" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

ProfileSettingsPage.Layout = Layout;
