import { Button, Input } from '@components/ui';
import { FormEvent } from 'react';

interface FileDisputeProps {
  formSubmit: (e: FormEvent) => void;
  inputOnChange: (value: string) => void;
  message: string;
  error: string | null;
  close: () => void;
}

export default function FileDispute({
  formSubmit,
  inputOnChange,
  message,
  error,
  close,
}: FileDisputeProps) {
  return (
    <div>
      <form onSubmit={formSubmit} className="space-y-3">
        <Input
          label="Message"
          name="dispute-message"
          onChange={inputOnChange}
          value={message}
        />
        <div className="flex gap-x-3">
          <Button onClick={close} label="Cancel" style="secondary">
            Cancel
          </Button>
          <Button label="Submite Disput" type="submit">
            Submit
          </Button>
        </div>
      </form>
      {error && (
        <p className="mt-5 text-danger font-bold text-center">{error}</p>
      )}
    </div>
  );
}
