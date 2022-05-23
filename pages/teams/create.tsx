import Input from '@components/ui/Input';
import Layout from '@components/ui/Layout';
import { Team } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState<string | null>();
  const router = useRouter();
  const create = async () => {
    const request = await fetch('/api/team/create', {
      method: 'POST',
      body: JSON.stringify({ teamName }),
    });
    if (request.status !== 200) {
      setError('Something went wrong.');
      return;
    }
    const { data: team }: { data: Team } = await request.json();
    router.push(`/teams/${team.id}`);
  };
  return (
    <div className="container">
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          create();
        }}
        className="max-w-xl mx-auto mt-20 space-y-3"
      >
        <div>
          <Input
            id="team-name"
            type="text"
            name="name"
            value={teamName}
            onChange={(value: string) => setTeamName(value)}
            label="Team Name"
          />
        </div>
        <button type="submit" className="btn">
          Create
        </button>
      </form>
    </div>
  );
}

CreateTeam.Layout = Layout;
