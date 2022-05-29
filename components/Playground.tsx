import { ImageData } from '@nouns/assets';
import { useState } from 'react';
import Image from 'next/image';
import randomNumber from '@lib/random-number';
import makeNoun from '@lib/make-noun';
import Select from './ui/Select';
import { Button } from './ui';

function cleanName(name: string) {
  const split = name.split('-');
  split.shift();
  const caps = split.map((word) => word[0].toUpperCase() + word.substring(1));
  return caps.join(' ');
}

interface PlaygroundProps {
  userId: string;
}

export default function Playground({ userId }: PlaygroundProps) {
  const [head, setHead] = useState(randomNumber(233));
  const [body, setBody] = useState(randomNumber(29));
  const [accessory, setAccessory] = useState(randomNumber(136));
  const [glasses, setGlasses] = useState(randomNumber(20));

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
    console.log({ updatePfpRes });
  };

  return (
    <div>
      <h3 className="text-3xl font-bold mb-5">Generate Noun</h3>
      <div className="flex space-x-10">
        <div className="space-y-3 col-span-1">
          <Select
            options={ImageData.images.bodies.map(({ filename }, i) => ({
              name: cleanName(filename),
              value: i,
            }))}
            label="Body"
            id="body"
            onChange={(value) => setBody(parseInt(value, 10))}
          />
          <Select
            options={ImageData.images.accessories.map(({ filename }, i) => ({
              name: cleanName(filename),
              value: i,
            }))}
            label="Accessory"
            id="accessory"
            onChange={(value) => setAccessory(parseInt(value, 10))}
          />
          <Select
            options={ImageData.images.heads.map(({ filename }, i) => ({
              name: cleanName(filename),
              value: i,
            }))}
            label="Head"
            id="head"
            onChange={(value) => setHead(parseInt(value, 10))}
          />
          <Select
            options={ImageData.images.glasses.map(({ filename }, i) => ({
              name: cleanName(filename),
              value: i,
            }))}
            label="Glasses"
            id="glasess"
            onChange={(value) => setGlasses(parseInt(value, 10))}
          />
          <div>
            <Button label="new-noun" onClick={setNounAsPfp}>
              Set As New Noun
            </Button>
          </div>
        </div>
        <div
          style={{ backgroundColor: `#${ImageData.bgcolors[0]}` }}
          className="relative flex items-center col-span-3 h-[400px] w-[400px]"
        >
          <div className="absolute top-0" style={{ zIndex: 8 }}>
            <Image
              src={`/noun/glasses/${ImageData.images.glasses[glasses].filename}.png`}
              height="400px"
              width="400px"
              alt=""
            />
          </div>
          <div className="absolute top-0" style={{ zIndex: 7 }}>
            <Image
              src={`/noun/accessories/${ImageData.images.accessories[accessory].filename}.png`}
              height="400px"
              width="400px"
              alt=""
            />
          </div>
          <div className="absolute top-0" style={{ zIndex: 6 }}>
            <Image
              src={`/noun/heads/${ImageData.images.heads[head].filename}.png`}
              height="400px"
              width="400px"
              alt=""
            />
          </div>
          <div className="absolute top-0" style={{ zIndex: 5 }}>
            <Image
              src={`/noun/bodies/${ImageData.images.bodies[body].filename}.png`}
              height="400px"
              width="400px"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
