import makeNoun from '@lib/make-noun';
import { useState } from 'react';
import randomNumber from '../random-number';

export default function usePlayground(userId?: string) {
  const [head, setHead] = useState(randomNumber(233));
  const [body, setBody] = useState(randomNumber(29));
  const [accessory, setAccessory] = useState(randomNumber(136));
  const [glasses, setGlasses] = useState(randomNumber(20));
  const [error, setError] = useState<string | null>();

  const noun = {
    head,
    body,
    accessory,
    glasses,
  };

  const setNounAsPfp = async () => {
    const seed = {
      background: 0,
      body,
      accessory,
      head,
      glasses,
    };
    const pfp = await makeNoun(seed);
    const request = await fetch(`/api/user/${userId}/update-pfp`, {
      method: 'POST',
      body: JSON.stringify({ pfp }),
    });
    const updatePfpRes = await request.json();
    if (updatePfpRes.error) {
      setError(updatePfpRes.error);
    }
  };

  return {
    noun,
    error,
    setNounAsPfp,
    setHead,
    setBody,
    setAccessory,
    setGlasses,
  };
}
