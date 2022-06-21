import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Layout } from '@components/common';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Select } from '@components/ui';
import countTotalRounds from '@lib/count-total-rounds';
import FileInput from '@components/ui/FileInput';
import createTournament from '@lib/createTournament';
import dynamic from 'next/dynamic';
import SunEditorCore from 'suneditor/src/lib/core';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

const convertTitleToSlug = (title: string) => {
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  return slug;
};

interface CreateTournamentProps {
  userId: string;
}

export default function CreateTournament({ userId }: CreateTournamentProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [slug, setSlug] = useState('');
  const [banner, setBanner] = useState<File | null>();
  const [format, setFormat] = useState('Single Elimination');
  const [maxPlayers, setMaxPlayers] = useState(32);
  const [roundWinConditions, setRoundWinConditions] = useState<
    number[] | null
  >();
  const [stream, setStream] = useState('');
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  const calculateTotalRounds = useCallback(
    (players: string) => countTotalRounds(players),
    [],
  );

  const editor = useRef<SunEditorCore>();

  useEffect(() => {
    const totalRounds = calculateTotalRounds(`${maxPlayers}`);
    const winConditions = [];
    for (let i = 0; i < totalRounds; i += 1) {
      winConditions.push(1);
    }
    setRoundWinConditions(winConditions);
  }, [maxPlayers, calculateTotalRounds]);

  useEffect(() => {
    setSlug(convertTitleToSlug(name));
  }, [name]);

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();

    const tournament = {
      name,
      format,
      startDate,
      createdBy: userId,
      slug,
      game: 'VALORANT',
      maxRegistrants: maxPlayers,
      mainStream: stream,
      roundWinConditions,
    };

    const { slug: url, error: err } = await createTournament(
      tournament,
      banner,
      userId,
    );

    if (err) {
      setError(err);
      return;
    }

    router.push(url);
  };

  return (
    <div className="container">
      <h1 className="text-3xl mb-5 font-bold">Create Tournament</h1>
      <div className="grid grid-cols-2 gap-x-10">
        <div>
          <h3 className="text-2xl font-bold mb-5">Basic Information</h3>
          <div className="p-10 bg-gray-700 rounded-lg">
            <form onSubmit={create} className="space-y-3">
              <div>
                <Input
                  name="name"
                  label="Tournament Name"
                  value={name}
                  onChange={(value: string) => setName(value)}
                />
              </div>
              <div>
                <Input
                  name="slug"
                  label="URL"
                  value={slug}
                  onChange={(value: string) =>
                    setSlug(convertTitleToSlug(value))
                  }
                />
                <span className="text-xs text-gray-500">{`${process.env.NEXTAUTH_URL}/${slug}`}</span>
              </div>
              <div>
                <span className="label">Banner 1032x480</span>
                <FileInput setFile={(files) => setBanner(files[0])} />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-white capitalize"
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
              <div>
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
              </div>
              <div>
                <Select
                  id="max-players"
                  label="Max Players"
                  onChange={(value) => setMaxPlayers(parseInt(value, 10))}
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
              </div>
              {roundWinConditions && roundWinConditions.length >= 2 && (
                <div>
                  <label
                    className="label text-xl font-bold"
                    htmlFor="round-format-0"
                  >
                    Round Matches
                  </label>
                  <div className="space-y-3">
                    {roundWinConditions.map((_, i) => (
                      /* eslint-disable-next-line */
                      <div className="flex flex-col w-full" key={i}>
                        <label
                          htmlFor={`round-format-${i}`}
                          className="flex items-center col-span-1 text-sm whitespace-nowrap"
                        >
                          Round {i + 1}
                        </label>
                        <div className="w-full">
                          <Select
                            id={`round-format-${i}`}
                            onChange={(value) => {
                              const current = roundWinConditions;
                              current[i] = parseInt(value, 10);
                              setRoundWinConditions(current);
                            }}
                            defaultValue="32"
                            options={[
                              { name: 'Best of 1', value: '1' },
                              { name: 'Best of 3', value: '2' },
                              { name: 'Best of 5', value: '3' },
                              { name: 'Best of 7', value: '4' },
                              { name: 'Best of 9', value: '5' },
                            ]}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Input
                  name="steam"
                  label="Main Stream"
                  value={stream}
                  onChange={(value: string) => setStream(value)}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  label="create tournament"
                  onClick={() => {}}
                >
                  Create
                </Button>
              </div>
              {error && <span className="form-warning">{error}</span>}
            </form>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-5">Details & Rules</h3>
          <div className="bg-white text-black">
            <SunEditor
              height="500px"
              getSunEditorInstance={getSunEditorInstance}
            />
          </div>
        </div>
      </div>
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
