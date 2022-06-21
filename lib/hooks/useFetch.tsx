import { useQuery } from 'react-query';

const fetcher = async (url: string) => {
  const req = await fetch(url);
  const data = await req.json();
  return data;
};

export default function useFetch(url: string, name: string, initialData: any) {
  return useQuery(name, () => fetcher(url), {
    initialData,
  });
}
