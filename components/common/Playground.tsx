import type { Noun } from '@lib/types';
import { ImageData } from '@nouns/assets';
import Image from 'next/image';
import Select from '../ui/Select';

function cleanName(name: string) {
  const split = name.split('-');
  split.shift();
  const caps = split.map((word) => word[0].toUpperCase() + word.substring(1));
  return caps.join(' ');
}

interface PlaygroundProps {
  noun: Noun;
  setBody: (value) => void;
  setAccessory: (value) => void;
  setGlasses: (value) => void;
  setHead: (value) => void;
  error: string;
}

export default function Playground({
  noun,
  setBody,
  setAccessory,
  setGlasses,
  setHead,
  error,
}: PlaygroundProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-3">
        <div className="space-y-3">
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
            id="glasses"
            onChange={(value) => setGlasses(parseInt(value, 10))}
          />
        </div>
        <div
          style={{ backgroundColor: `#${ImageData.bgcolors[0]}` }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute bottom-0" style={{ zIndex: 8 }}>
            <button onClick={() => console.log(ImageData.images.glasses)}>
              Test
            </button>
            {noun.glasses}
            {/* <Image
              src={`/noun/glasses/${
                ImageData.images.glasses[noun.glasses].filename
              }.png`}
              height="275px"
              width="275px"
              alt=""
            /> */}
          </div>
          <div className="absolute bottom-0" style={{ zIndex: 6 }}>
            <Image
              src={`/noun/accessories/${
                ImageData.images.accessories[noun.accessory].filename
              }.png`}
              height="275px"
              width="275px"
              alt=""
            />
          </div>
          <div className="absolute bottom-0" style={{ zIndex: 7 }}>
            <Image
              src={`/noun/heads/${
                ImageData.images.heads[noun.head].filename
              }.png`}
              height="275px"
              width="275px"
              alt=""
            />
          </div>
          <div className="absolute bottom-0" style={{ zIndex: 5 }}>
            <Image
              src={`/noun/bodies/${
                ImageData.images.bodies[noun.body].filename
              }.png`}
              height="275px"
              width="275px"
              alt=""
            />
          </div>
        </div>
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
