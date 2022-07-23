import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/solid';

interface ScoreInputProps {
  name: string;
  score: number;
  updateScore: (value: number) => void;
}

const MatchScoreInput = ({ name, score, updateScore }: ScoreInputProps) => (
  <div className="mb-3">
    <label
      htmlFor="team-two-score"
      className="text-2xl text-center w-full block mb-3"
    >
      {name}&apos;s Score
    </label>
    <div className="flex justify-evenly space-x-3">
      <button
        type="button"
        className="block w-6 text-gray-500"
        onClick={() => updateScore(score - 1)}
      >
        <MinusCircleIcon />
      </button>
      <span className="text-2xl">{score}</span>
      <button
        type="button"
        className="block w-6 text-gray-500"
        onClick={() => updateScore(score + 1)}
      >
        <PlusCircleIcon />
      </button>
    </div>
  </div>
);

export default MatchScoreInput;
