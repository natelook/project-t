import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Layout } from '@components/common';
import { FormEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Tournament } from '@prisma/client';

const convertTitleToSlug = (title: string) => {
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  return slug;
};

export default function CreateTournament() {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [slug, setSlug] = useState('');
  const [format] = useState('Single Elimination');
  const [error, setError] = useState<string | null>();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setSlug(convertTitleToSlug(name));
  }, [name]);

  const create = async (e: FormEvent) => {
    e.preventDefault();

    const request = await fetch('/api/tournament/create', {
      method: 'POST',
      body: JSON.stringify({
        name,
        format,
        startDate: dayjs(startDate).toISOString(),
        createdBy: session?.user.id,
        slug,
      }),
    });
    const createdTournament: Tournament = await request.json();

    if (request.status !== 200) {
      setError('something went wrong');
    }
    router.push(`/${createdTournament.slug}`);
  };

  return (
    <div className="container max-w-2xl mt-24">
      <h1 className="text-4xl mb-6">Create Tournament</h1>
      <form onSubmit={create} className="space-y-3">
        <Input
          name="name"
          label="Tournament Name"
          value={name}
          onChange={(value: string) => setName(value)}
        />
        <div>
          <Input
            name="slug"
            label="URL"
            value={slug}
            onChange={(value: string) => setSlug(convertTitleToSlug(value))}
          />
          <span className="text-xs text-gray-500">{`${process.env.NEXTAUTH_URL}/${slug}`}</span>
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-900 capitalize"
            htmlFor="startDate"
          >
            Start Date
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            showTimeSelect
            dateFormat="M/d/y HH:mma"
            timeFormat="HH:mm"
            timeIntervals={15}
            className="w-full input"
          />
        </div>
        <Input
          name="format"
          label="Tournament Format"
          value={format}
          onChange={() => {}}
        />
        <Button type="submit" label="create tournament" onClick={() => {}}>
          Create
        </Button>
        {error && (
          <span className="text-red-600 uppercase text-sm">{error}</span>
        )}
      </form>
    </div>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req });
  return { props: { session, test: 'hello' } };
}

CreateTournament.Layout = Layout;
CreateTournament.auth = true;
