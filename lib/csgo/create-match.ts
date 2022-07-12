import supabase from '@lib/supabase';

const createMatch = async () => {
  const newMatch = await supabase.from('CSGOMatch').insert({
    team1Players: ['STEAM_1:0:445790386'],
    maps: {
      de_mirage: true,
      de_inferno: false,
      de_dust2: true,
      de_nuke: true,
      de_overpass: true,
      de_train: true,
      de_vertigo: true,
      de_ancient: true,
    },
  });
  console.log(newMatch.error);

  if (!newMatch?.body) return null;

  return newMatch.body[0].id;
};

export default createMatch;
