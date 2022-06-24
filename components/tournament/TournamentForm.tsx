import { TextEditor } from '@components/common';
import { Button, FileInput, Input, Select, Form } from '@components/ui';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UseFormRegister, UseFormReturn } from 'react-hook-form';

interface TournamentFormProps {
  methods: UseFormReturn<any>;
  error: string | null;
  register: UseFormRegister<any>;
  editor: any;
  submit: (values: any) => void;
  setStartDate: (date: Date) => void;
  setBanner: (file: File) => void;
  roundWinConditions: number[];
  startDate: Date;
}

export default function TournamentForm({
  submit,
  error,
  register,
  methods,
  editor,
  setStartDate,
  setBanner,
  roundWinConditions,
  startDate,
}: TournamentFormProps) {
  return (
    <div className="grid grid-cols-2 gap-x-10">
      <div>
        <h3 className="text-2xl font-bold mb-5">Basic Information</h3>
        <div className="p-10 bg-gray-700 rounded-lg">
          <Form onSubmit={submit} methods={methods}>
            <div className="space-y-3">
              <Input name="name" label="Tournament Name" register={register} />
              <Input name="slug" label="URL" register={register} />
              {/* <span className="text-xs text-gray-500">{`${process.env.NEXTAUTH_URL}/${tournament.slug}`}</span> */}
              <span className="label">Banner 1032x480</span>
              <FileInput setFile={(files) => setBanner(files[0])} />
              <div>
                <label
                  className="block text-sm font-medium text-white capitalize"
                  htmlFor="startDate"
                >
                  Start Date
                </label>
                <DatePicker
                  id="startDate"
                  selected={startDate}
                  onChange={(date: Date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="M/d/y HH:mma"
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  className="w-full input text-black"
                />
              </div>
              <Select
                id="format"
                label="Tournament Format"
                name="format"
                register={register}
                options={[
                  { name: 'Single Elimination' },
                  { name: 'Double Elimination' },
                  { name: 'Round Robin' },
                  { name: 'GSL' },
                ]}
              />
              <Select
                name="max-players"
                id="max-players"
                label="Max Players"
                register={register}
                options={[
                  { name: '8' },
                  { name: '16' },
                  { name: '32' },
                  { name: '64' },
                  { name: '128' },
                  { name: '256' },
                ]}
              />
              {roundWinConditions && roundWinConditions.length >= 2 && (
                <div>
                  <label
                    className="label text-xl font-bold"
                    htmlFor="round-format-0"
                  >
                    Round Matches
                  </label>
                  <div className="space-y-3">
                    {roundWinConditions.map((_, i) => (
                      /* eslint-disable-next-line */
                      <div className="flex flex-col w-full" key={i}>
                        <label
                          htmlFor={`round-format-${i}`}
                          className="flex items-center col-span-1 text-sm whitespace-nowrap"
                        >
                          Round {i + 1}
                        </label>
                        <Select
                          id={`round-format-${i}`}
                          name={`round-${i + 1}-format`}
                          defaultValue="32"
                          register={register}
                          options={[
                            { name: 'Best of 1', value: '1' },
                            { name: 'Best of 3', value: '2' },
                            { name: 'Best of 5', value: '3' },
                            { name: 'Best of 7', value: '4' },
                            { name: 'Best of 9', value: '5' },
                          ]}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Input name="steam" label="Main Stream" register={register} />
              <Button type="submit" label="create tournament">
                Create
              </Button>
              {error && <span className="form-warning">{error}</span>}
            </div>
          </Form>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-5">Details & Rules</h3>
        <TextEditor editor={editor} />
      </div>
    </div>
  );
}
