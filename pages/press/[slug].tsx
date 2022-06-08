import { Layout } from '@components/common';
import sanity from '@lib/sanity';
import { PostProps } from '@lib/types';
import { PortableText } from '@portabletext/react';
import dayjs from 'dayjs';
import { GetServerSidePropsContext } from 'next';
import { groq } from 'next-sanity';

interface SinglePressPageProps {
  post: PostProps;
}

export default function SinglePressPage({ post }: SinglePressPageProps) {
  return (
    <div className="max-w-xl mx-auto prose">
      <h1 className="mb-0">{post.title}</h1>
      <span className="block text-gray-500 uppercase text-sm">
        {dayjs(post.createdAt).format('MMMM D, YYYY')}
      </span>
      <PortableText value={post.body} />
    </div>
  );
}

export async function getStaticPaths() {
  const posts = await sanity.fetch(
    groq`*[_type == 'post'] { "slug": slug.current }`,
  );

  const paths = posts.map((post: { slug: string }) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: GetServerSidePropsContext) {
  const post = await sanity.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      title,
      body,
      "createdAt": _createdAt,
      "slug": slug.current,
    }`,
    { slug: params?.slug },
  );
  return { props: { post } };
}

SinglePressPage.Layout = Layout;
