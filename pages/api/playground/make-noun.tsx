import { NextApiRequest, NextApiResponse } from 'next';
import { getNounData, ImageData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk';
// import randomNumber from '@lib/random-number';

const { palette } = ImageData;

export default (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { seed } = body;
  if (!seed) {
    return res.status(400).json({ error: 'Seed is required' });
  }

  const { parts, background } = getNounData(seed);
  const svgBinary = buildSVG(parts, palette, background);

  return res.status(200).json(svgBinary);
};
