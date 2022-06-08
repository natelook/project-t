import { createClient } from 'next-sanity';

const sanity = createClient({
  dataset: 'production',
  projectId: 'y5rbsgl5',
  useCdn: false,
  apiVersion: '2021-03-25',
});

export default sanity;
