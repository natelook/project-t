import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { Layout } from '@components/common';

export default function Home() {
  return (
    <div className="">
      <p>Hello</p>
      <Link href="/teams">
        <a>Teams</a>
      </Link>
    </div>
  );
}

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const session = await getSession({ req });
  return { props: { session } };
}

Home.Layout = Layout;
