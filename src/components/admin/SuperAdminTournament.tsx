interface AdminProps {
  tournamentId: string;
}

export default function SuperAdminTournament({ tournamentId }: AdminProps) {
  const registerTeams = async () => {
    await fetch('/api/admin/register-teams', {
      method: 'POST',
      body: JSON.stringify({
        tournamentId,
        numberOfTeams: 40,
      }),
    });
  };
  return (
    <div className="fixed bottom-2 right-2 w-80 h-20 border p-5 rounded drop-shadow bg-black text-white">
      <ul>
        <li>
          <button type="button" onClick={registerTeams}>
            Register Teams
          </button>
        </li>
      </ul>
    </div>
  );
}
