import { Layout } from '@components/common';
import { TeamHeading } from '@components/team';
import { Modal } from '@components/ui';
import pfp from '@lib/pfp';
import {
  MatchWithTeamsAndTournament,
  TeamWithPlayersAndOwner,
} from '@lib/types';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';

interface MatchPageProps {
  match: MatchWithTeamsAndTournament;
}

interface TeamProps {
  team: TeamWithPlayersAndOwner;
  score: number;
}

const Team: React.FC<TeamProps> = ({ team, score }) => (
  <div className="space-y-8">
    <h4 className="text-5xl font-bold text-center">{team.name}</h4>
    <span className="block text-center text-7xl">{score}</span>
    <div className="flex justify-between bg-nouns-bg px-10 pt-5 rounded">
      {team?.players.map((player) => (
        <div key={player.id} className="w-20 h-20">
          <Image
            src={player.pfp ? pfp(player.pfp) : '/default-pfp.png'}
            layout="responsive"
            height={50}
            width={50}
          />
        </div>
      ))}
    </div>
  </div>
);

export default function MatchPage({ match }: MatchPageProps) {
  const [scoreModal, setScoreModal] = useState(false);

  // const submitScore = () => {
  //   console.log('hello');
  // };
  const report = () => {};
  return (
    <React.Fragment>
      <div>
        <TeamHeading
          name={`${match.tournament.name} - Match ${match.matchId}`}
          primaryButton={() => setScoreModal(true)}
          primaryButtonText="Submit Score"
          secondaryButton={report}
          secondaryButtonText="Report a Problem"
          isOwner
        />

        <div className="grid grid-cols-match gap-x-10 mt-20">
          <Team team={match.teamOne} score={0} />
          <div className="h-full flex items-center justify-center">
            <span className="font-bold font-nouns text-5xl">VS</span>
          </div>
          <Team team={match.teamTwo} score={0} />
        </div>
      </div>
      {scoreModal && (
        <Modal open={scoreModal} setOpen={() => setScoreModal(true)}>
          <p>Hello</p>
        </Modal>
      )}
    </React.Fragment>
  );
}

MatchPage.Layout = Layout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${context.params?.slug}/${context.params?.matchId}`,
  );
  const match = await request.json();
  return { props: { match } };
}
