import { Layout } from '@components/common';
import sanity from '@lib/sanity';
import { PostProps } from '@lib/types';
import dayjs from 'dayjs';
import { groq } from 'next-sanity';
import Link from 'next/link';

interface PressPageProps {
  posts: PostProps[];
}

export default function PressPage({ posts }: PressPageProps) {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-5xl font-bold mb-5">Press</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <Link href={`/press/${post.slug}`} key={post.id}>
            <a className="block">
              <div>
                <span className="uppercase text-sm text-gray-400 block -mb-1">
                  {dayjs(post.createdAt).format('MM/DD/YY')}
                </span>
                <h2 className="text-2xl">{post.title}</h2>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const posts =
    await sanity.fetch(groq`*[_type == "post"] | order(_createdAt desc) {
    "id": _id,
    title,
    "slug": slug.current,
    "createdAt": _createdAt
  }`);
  return { props: { posts } };
}

PressPage.Layout = Layout;
