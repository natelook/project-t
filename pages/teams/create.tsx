import Input from '@components/ui/Input';
import Layout from '@components/ui/Layout';
import React, { FormEvent, useState } from 'react';

export default function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const create = async () => {
    const request = await fetch('/api/team/create', {
      method: 'POST',
      body: JSON.stringify({ teamName }),
    });
    const data = await request.json();
    console.log(data);
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
            placeholder="Team Name"
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
