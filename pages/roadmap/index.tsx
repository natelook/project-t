import { Layout } from '@components/common';
import sanity from '@lib/sanity';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import { groq } from 'next-sanity';
import { PortableTextBlock } from '@portabletext/types';

interface Roadmap {
  title: string;
  body: PortableTextBlock[];
}

interface RoadmapPageProps {
  roadmap: Roadmap;
}

export default function RoadmapPage({ roadmap }: RoadmapPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-3xl font-bold mb-5"
      >
        {roadmap.title}
      </motion.h1>
      <motion.article
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.3 }}
        className="prose prose-invert p-10 bg-gray-700 rounded-lg shadow shadow-gray-700 w-full"
      >
        <PortableText value={roadmap.body} />
      </motion.article>
    </div>
  );
}

export async function getStaticProps() {
  const roadmap =
    await sanity.fetch(groq`*[_type == 'roadmap' && slug.current == 'notes'][0] {
    _id,
    title,
    body
  }`);
  return { props: { roadmap } };
}

RoadmapPage.Layout = Layout;
