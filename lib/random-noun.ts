import randomNouns from './random-nouns.json';
import randomNumber from './random-number';

const randomNoun = (justBase64?: boolean) => {
  if (justBase64) {
    // @ts-ignore
    return randomNouns[randomNumber(499)];
  }
  // @ts-ignore
  return `data:image/svg+xml;base64,${randomNouns[randomNumber(499)]}`;
};

export default randomNoun;
