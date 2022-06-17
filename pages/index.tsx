import { Layout } from '@components/common';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import TournamentCard from '@components/tournament/TournamentCard';
import { TournamentWithRegistrants } from '@lib/types';
import { Button } from '@components/ui';
import { useRouter } from 'next/router';

interface HomeProps {
  tournaments: TournamentWithRegistrants[];
}

export default function Home({ tournaments }: HomeProps) {
  const router = useRouter();
  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="col-span-2"
      >
        <div className="flex justify-evenly items-center w-full mb-10 py-32">
          <motion.div
            initial={{ y: 5 }}
            animate={{ y: -5 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: 'reverse',
            }}
          >
            <Image
              src="/logo-left.svg"
              alt="Left Logo"
              width="268.4px"
              height="200px"
              priority
            />
          </motion.div>
          <div className="text-center">
            <h1 className="text-6xl uppercase font-bold tracking-tighter">
              Tournaments.wtf
            </h1>
            <p className="text-gray-500 uppercase tracking-widest font-bold">
              The backbone behind competitions
            </p>
            <div className="flex space-x-5 px-10 mt-5">
              <Button
                label="Find a Team"
                onClick={() => router.push('/teams')}
                style="secondary"
              >
                Find a Team
              </Button>
              <Button
                label="Tournament Link"
                onClick={() => router.push('/tournaments')}
              >
                All Tournaments
              </Button>
            </div>
          </div>
          <motion.div
            initial={{ y: -5 }}
            animate={{ y: 5 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: 'reverse',
            }}
          >
            <Image
              src="/logo-right.svg"
              alt="Right Logo"
              width="268.4px"
              height="200px"
              priority
            />
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="col-span-4 mb-10"
      >
        <div>
          <h2 className="text-3xl font-bold mb-1">Featured Tournaments</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                name={tournament.name}
                totalPlayers={tournament.registrants.length}
                slug={tournament.slug}
                maxPlayers={tournament.maxRegistrants}
                date={tournament.startDate}
                banner={tournament.banner}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export async function getServerSideProps() {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournaments/featured`,
  );
  const featuredTournaments = await request.json();
  return { props: { tournaments: featuredTournaments } };
}

Home.Layout = Layout;
