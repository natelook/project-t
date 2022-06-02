export default function SuperAdminTournament() {
  const registerTeams = async () => {
    await fetch('/api/admin/register-teams', {
      method: 'POST',
      body: JSON.stringify({
        tournamentId: 'cl3ws0not02796o0h7yw152ul',
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
