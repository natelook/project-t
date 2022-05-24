// import Input from '@components/ui/Input';
import Layout from '@components/ui/Layout';
import Modal from '@components/ui/Modal';
import Select from '@components/ui/Select';
import TournamentHeading from '@components/ui/TournamentHeading';
import { Dialog } from '@headlessui/react';
import { Tournament } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRef, useState } from 'react';

interface TournamentPageProps {
  tournament: Tournament;
}

export default function TournamentPage({ tournament }: TournamentPageProps) {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  return (
    <div>
      <TournamentHeading
        name={tournament.name}
        date={tournament.startDate}
        register={() => setRegisterModalOpen(true)}
      />
      {registerModalOpen && (
        <Modal
          open={registerModalOpen}
          setOpen={(isOpen: boolean) => setRegisterModalOpen(isOpen)}
          initialFocus={cancelButtonRef}
        >
          <Dialog.Title
            as="h3"
            className="text-lg leading-6 font-medium text-gray-900"
          >
            Register Team
          </Dialog.Title>
          <form className="mt-4">
            <Select label="Choose Team" />
          </form>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              onClick={() => setRegisterModalOpen(false)}
            >
              Deactivate
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={() => setRegisterModalOpen(false)}
              ref={cancelButtonRef}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const request = await fetch(
    `${process.env.NEXTAUTH_URL}/api/tournament/${context.params?.slug}`,
  );
  const tournament = await request.json();
  if (!tournament) {
    return { notFound: true };
  }

  const session = await getSession(context);

  return { props: { tournament, session } };
}

TournamentPage.Layout = Layout;
