import Layout from '@components/ui/Layout';
import Link from 'next/link';

export default function TeamsPage() {
  return (
    <main className="container">
      <div className="prose">
        <h1>Teams</h1>
        <Link href="/teams/create">
          <a>Create</a>
        </Link>
      </div>
    </main>
  );
}

TeamsPage.Layout = Layout;
