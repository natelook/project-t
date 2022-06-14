import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#2B2B2B]">
      <div>
        <div className="flex justify-between items-center">
          <div>
          <Image
            src="/left-faces.svg"
            alt="Left Faces"
            width="335.5px"
            height="500px"
            priority
          />
          </div>
            <div className="mx-5">
        <h1 className="text-6xl uppercase font-nouns tracking-wider text-center text-white">
          Tournaments.wtf
        </h1>
        <p className="text-white text-xl text-center">The new hub for all Esports tournaments</p>
        </div>
            <div>
          <Image
            src="/right-faces.svg"
            alt="Right faces"
            width="335.5px"
            height="500px"
            priority
          />
          </div>
        </div>
      </div>
    </div>
  );
}

