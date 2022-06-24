import { TextEditor } from '@components/common';
import { Button, Form } from '@components/ui';
import BasicInfo from '@components/tournament/BasicFormInfo';
import { UseFormRegister, UseFormReturn } from 'react-hook-form';

interface TournamentFormProps {
  methods: UseFormReturn<any>;
  error: string | null;
  slugPreview: string;
  register: UseFormRegister<any>;
  editor: any;
  submit: (values: any) => void;
  setStartDate: (date: Date) => void;
  setBanner: (file: File) => void;
  roundWinConditions: number[];
  setRoundWinConditions: (arr: number[]) => void;
  startDate: Date;
}

export default function TournamentForm({
  submit,
  error,
  slugPreview,
  register,
  methods,
  editor,
  setStartDate,
  setBanner,
  roundWinConditions,
  setRoundWinConditions,
  startDate,
}: TournamentFormProps) {
  return (
    <div>
      <div>
        <Form onSubmit={submit} methods={methods}>
          <div>
            <div className="mb-5 grid grid-cols-2 gap-x-10">
              <div>
                <h3 className="text-2xl font-bold mb-5">Basic Information</h3>
                <div className="p-10 bg-gray-700 rounded-lg">
                  <BasicInfo
                    register={register}
                    setBanner={setBanner}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    roundWinConditions={roundWinConditions}
                    error={error}
                    setRoundWinConditions={setRoundWinConditions}
                    slugPreview={slugPreview}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold mb-5">Details & Rules</h3>
                <div className="p-10 bg-gray-700 rounded-lg  flex-auto">
                  <span className="label block mb-1">Description</span>
                  <TextEditor editor={editor} />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div>
                <Button type="submit" label="create tournament">
                  Create Tournament
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
