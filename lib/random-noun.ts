import randomNouns from './random-nouns.json';
import randomNumber from './random-number';

const randomNoun = () =>
  // @ts-ignore
  `data:image/svg+xml;base64,${randomNouns[randomNumber(499)]}`;

export default randomNoun;
