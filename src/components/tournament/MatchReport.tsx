import { Button } from '@components/ui';
import { MatchWithTeamsAndTournament } from '@lib/types';
import { FormEvent } from 'react';
import MatchScoreInput from './MatchScoreInput';

interface MatchReportProps {
  submitScore: (e: FormEvent) => void;
  match: MatchWithTeamsAndTournament;
  teamOneScore: number;
  teamTwoScore: number;
  close: () => void;
  setTeamOneScore: (score: number) => void;
  setTeamTwoScore: (score: number) => void;
}

export default function MatchReport({
  submitScore,
  match,
  teamOneScore,
  teamTwoScore,
  close,
  setTeamOneScore,
  setTeamTwoScore,
}: MatchReportProps) {
  return (
    <form onSubmit={submitScore}>
      <div className="grid grid-cols-2 gap-x-10 gap-y-3 place-content-center">
        <MatchScoreInput
          name={match.teamOne.name}
          score={teamOneScore}
          updateScore={(score) =>
            score <= match.winningScore &&
            setTeamOneScore(score <= 0 ? 0 : score)
          }
        />
        <MatchScoreInput
          name={match.teamTwo.name}
          score={teamTwoScore}
          updateScore={(score) =>
            score <= match.winningScore &&
            setTeamTwoScore(score <= 0 ? 0 : score)
          }
        />
        <div className="col-span-2 flex space-x-3 w-full">
          <Button label="Close Modal" onClick={close} style="secondary">
            Cancel
          </Button>
          <Button type="submit" label="submit score" onClick={() => {}}>
            Submit Score
          </Button>
        </div>
      </div>
    </form>
  );
}
