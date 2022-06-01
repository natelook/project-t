import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Layout } from '@components/common';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Tournament } from '@prisma/client';
import { Select } from '@components/ui';

const convertTitleToSlug = (title: string) => {
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  return slug;
};

interface CreateTournamentProps {
  userId: string;
}

export default function CreateTournament({ userId }: CreateTournamentProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [slug, setSlug] = useState('');
  const [format, setFormat] = useState('Single Elimination');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [maxRounds, setMaxRounds] = useState<number | null>();
  const [stream, setStream] = useState('');
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  console.log({ maxRounds });

  const calculateTotalRounds = useCallback((totalPlayers: string) => {
    const players = parseInt(totalPlayers, 10);
    let roundMatches = players / 2;
    let totalRounds = 1;
    const addRound = () => {
      if (roundMatches % 2 === 0) {
        roundMatches /= 2;
        totalRounds += 1;
        addRound();
      }
    };
    addRound();

    return totalRounds;
  }, []);

  useEffect(() => {
    setMaxRounds(calculateTotalRounds(maxPlayers));
  }, [maxPlayers, calculateTotalRounds]);

  useEffect(() => {
    setSlug(convertTitleToSlug(name));
  }, [name]);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError('You must be signed in.');
      return;
    }

    const request = await fetch('/api/tournament/create', {
      method: 'POST',
      body: JSON.stringify({
        name,
        format,
        startDate: dayjs(startDate).toISOString(),
        createdBy: userId,
        slug,
        game: 'VALORANT',
        maxRegistrants: parseInt(maxPlayers, 10),
        mainStream: stream,
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
            className="block text-sm font-medium text-gray-900 dark:text-white capitalize"
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
            className="w-full input text-black"
          />
        </div>
        <Select
          id="format"
          label="Tournament Format"
          defaultValue="Single Elimination"
          onChange={(value) => setFormat(value)}
          options={[
            { name: 'Single Elimination' },
            { name: 'Double Elimination' },
            { name: 'Round Robin' },
            { name: 'GSL' },
          ]}
        />
        <Select
          id="max-players"
          label="Max Players"
          onChange={(value) => setMaxPlayers(value)}
          defaultValue="32"
          options={[
            { name: '8' },
            { name: '16' },
            { name: '32' },
            { name: '64' },
            { name: '128' },
            { name: '256' },
          ]}
        />
        {maxRounds && maxRounds >= 2 && (
          <React.Fragment>
            <label className="label" htmlFor="round-format-0">
              Round Matches
            </label>

            {Array.from(Array(maxRounds), (_, i) => (
              <div className="grid grid-cols-4 gap-x-10">
                <label
                  htmlFor={`round-format-${i}`}
                  className="flex items-center col-span-1"
                >
                  Round {i + 1}
                </label>
                <div className="col-span-3">
                  <Select
                    id={`round-format-${i}`}
                    onChange={(v) => console.log(v)}
                    defaultValue="32"
                    options={[
                      { name: 'Best of 1', value: 'BO1' },
                      { name: 'Best of 3', value: 'BO3' },
                      { name: 'Best of 5', value: 'BO5' },
                      { name: 'Best of 7', value: 'BO7' },
                      { name: 'Best of 9', value: 'BO9' },
                    ]}
                  />
                </div>
              </div>
            ))}
          </React.Fragment>
        )}
        <Input
          name="steam"
          label="Main Stream"
          value={stream}
          onChange={(value: string) => setStream(value)}
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
  if (!session) {
    return { notFound: true };
  }
  return { props: { session, userId: session.user.id } };
}

CreateTournament.Layout = Layout;
CreateTournament.auth = true;
