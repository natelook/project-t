import React, { ChangeEvent } from 'react';

const FileInput: React.FC<{ setFile: (file: FileList) => void }> = ({
  setFile,
}) => (
  <input
    type="file"
    onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files)}
    accept="image/png"
  />
);

export default FileInput;
