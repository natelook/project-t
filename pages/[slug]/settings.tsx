import { Layout } from '@components/common';
import TournamentForm from '@components/tournament/TournamentForm';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState } from 'react';
import { createTournament } from '@lib/tournament-utils';
import useNotification from '@lib/hooks/useNotification';
import { Banner } from '@components/ui';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { Tournament } from '@prisma/client';
import { useForm } from 'react-hook-form';

interface SettingsProps {
  tournament: Tournament;
  userId: string;
}

export default function Settings({ tournament, userId }: SettingsProps) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(tournament.startDate),
  );
  const [banner, setBanner] = useState<File | null>();
  const [error, setError] = useState<string | null>();
  const [roundWinConditions, setRoundWinConditions] = useState(
    tournament.roundWinConditions,
  );
  const [slug] = useState(tournament.slug);

  const { isActive, message, triggerNotification, notificationColor } =
    useNotification();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write the description and rules for the tournament',
      }),
    ],
    content: tournament.description ? JSON.parse(tournament.description) : '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm m-5 focus:outline-none',
      },
    },
  });

  const methods = useForm({
    defaultValues: {
      name: tournament.name,
      format: tournament.format,
      maxPlayers: tournament.maxRegistrants,
      stream: tournament.mainStream,
      slug: tournament.slug,
    },
  });

  const { handleSubmit, register } = methods;

  const update = async (values: any) => {
    const { name, format, mainStream, maxPlayers } = values;
    const t = {
      name,
      format,
      startDate,
      createdBy: userId,
      slug,
      game: 'VALORANT',
      maxRegistrants: maxPlayers,
      mainStream,
      roundWinConditions,
      description: JSON.stringify(editor.getJSON()),
    };

    const { error: err } = await createTournament(
      t,
      banner,
      userId,
      tournament.slug,
    );

    if (err) {
      setError(err);
      return;
    }

    triggerNotification('Tournament successfully updated', 'success');
  };

  return (
    <React.Fragment>
      <div>
        <h1>Settings</h1>

        <TournamentForm
          methods={methods}
          register={register}
          error={error}
          editor={editor}
          setBanner={(f) => setBanner(f)}
          setStartDate={(d) => setStartDate(d)}
          submit={handleSubmit(update)}
          roundWinConditions={roundWinConditions}
          startDate={startDate}
          setRoundWinConditions={(arr) => setRoundWinConditions(arr)}
          slugPreview={slug}
        />
      </div>
      {isActive && (
        <Banner
          icon={<CheckCircleIcon />}
          message={message}
          color={notificationColor}
        />
      )}
    </React.Fragment>
  );
}

export async function getServerSideProps({
  params,
  req,
}: GetServerSidePropsContext) {
  const session = await getSession({ req });

  if (!session) {
    return { notFound: true };
  }

  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${params?.slug}`,
  );
  const tournament = await request.json();
  return { props: { tournament, userId: session.user.id } };
}

Settings.Layout = Layout;
