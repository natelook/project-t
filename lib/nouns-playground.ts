import randomNumber from './random-number';

interface Seed {
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
}

const makeNoun = async (seed?: Seed) => {
  const defaultSeed = {
    background: 0,
    body: randomNumber(29),
    accessory: randomNumber(136),
    head: randomNumber(233),
    glasses: randomNumber(20),
  };
  const request = await fetch('/api/playground/make-noun', {
    method: 'POST',
    body: JSON.stringify({ seed: seed || defaultSeed }),
  });
  const data = await request.json();
  const svgBase64 = btoa(data);
  return svgBase64;
};

export default makeNoun;
