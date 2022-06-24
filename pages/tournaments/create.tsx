import type { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import { Layout } from '@components/common';
import { createTournament } from '@lib/tournament-utils';
import TournamentForm from '@components/tournament/TournamentForm';
import { useForm } from 'react-hook-form';

interface CreateTournamentProps {
  userId: string;
}

export default function CreateTournament({ userId }: CreateTournamentProps) {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [banner, setBanner] = useState<File | null>();
  // const [roundWinConditions, setRoundWinConditions] = useState<
  //   number[] | null
  // >();
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write the description and rules for the tournament',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm m-5 focus:outline-none',
      },
    },
  });
  const methods = useForm();

  // const calculateTotalRounds = useCallback(
  //   (players: string) => countTotalRounds(players),
  //   [],
  // );

  // useEffect(() => {
  //   const totalRounds = calculateTotalRounds(`${8}`);
  //   const winConditions = [];
  //   for (let i = 0; i < totalRounds; i += 1) {
  //     winConditions.push(1);
  //   }
  //   setRoundWinConditions(winConditions);
  // }, [maxPlayers, calculateTotalRounds]);

  // useEffect(() => {
  //   setSlug(convertTitleToSlug(name));
  // }, [name]);

  const create = async (values: any) => {
    const { name, format, slug, roundWinConditions, stream, maxPlayers } =
      values;
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
      description: JSON.stringify(editor.getJSON()),
    };
    const { slug: url, error: err } = await createTournament(
      tournament,
      banner,
      userId,
      'create',
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
      <TournamentForm
        methods={methods}
        roundWinConditions={[1, 1, 1, 1]}
        startDate={startDate}
        register={methods.register}
        error={error}
        editor={editor}
        setBanner={(f) => setBanner(f)}
        setStartDate={(d) => setStartDate(d)}
        submit={create}
      />
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
