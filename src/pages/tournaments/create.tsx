import { useRouter } from 'next/router';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import { Layout } from '@components/common';
import TournamentForm from '@components/tournament/TournamentForm';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import {
  convertTitleToSlug,
  countTotalRounds,
  createTournament,
} from '@lib/tournament-utils';
import { useSession } from 'next-auth/react';
import { trpc } from '@lib/trpc';

interface CreateTournamentProps {
  userId: string;
}

export default function CreateTournament({ userId }: CreateTournamentProps) {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [slug, setSlug] = useState('');
  const [banner, setBanner] = useState<File | null>();
  const [roundWinConditions, setRoundWinConditions] = useState<
    number[] | null
  >();
  const [error, setError] = useState<string | null>();
  const router = useRouter();
  const make = trpc.useMutation('createTournament');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write the description and rules for the tournament',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm m-5 h-full focus:outline-none',
      },
    },
  });

  const methods = useForm();
  const watchMaxPlayers = methods.watch('maxPlayers', '8');
  const watchSlug = methods.watch('slug', '');
  const calculateTotalRounds = useCallback(
    (players: string) => countTotalRounds(players),
    [],
  );

  useEffect(() => {
    setSlug(convertTitleToSlug(watchSlug));
  }, [watchSlug]);

  useEffect(() => {
    const totalRounds = calculateTotalRounds(`${watchMaxPlayers}`);
    const winConditions = [];
    for (let i = 0; i < totalRounds; i += 1) {
      winConditions.push(1);
    }
    setRoundWinConditions(winConditions);
  }, [watchMaxPlayers, calculateTotalRounds]);

  const create = async (values: any) => {
    const { name, format, mainStream, maxPlayers } = values;
    if (!editor || banner) return null;
    const tournament = {
      name,
      format,
      startDate,
      createdBy: userId,
      slug,
      game: 'VALORANT',
      maxRegistrants: parseInt(maxPlayers, 10),
      mainStream,
      roundWinConditions,
      description: JSON.stringify(editor.getJSON()),
    };

    await make.mutateAsync({ ...tournament, bannerFile: banner });

    const { slug: url, error: err } = await createTournament(
      tournament,
      banner,
      userId,
    );

    if (err || !url) {
      setError(err);
      return;
    }

    router.push(url);
  };

  return (
    <div className="container">
      <h1 className="text-3xl mb-5 font-bold">Create Tournament</h1>
      <TournamentForm
        methods={methods}
        roundWinConditions={roundWinConditions}
        slugPreview={slug}
        startDate={startDate}
        register={methods.register}
        error={error}
        editor={editor}
        setBanner={(f) => setBanner(f)}
        setStartDate={(d) => setStartDate(d)}
        submit={create}
        setRoundWinConditions={(arr) => setRoundWinConditions(arr)}
      />
    </div>
  );
}

CreateTournament.Layout = Layout;
CreateTournament.auth = true;
