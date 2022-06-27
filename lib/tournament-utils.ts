import type { Tournament } from '@prisma/client';
import type { PresignedPost } from 'aws-sdk/clients/s3';
import dayjs from 'dayjs';

// t = tournament
export const createTournament = async (
  t: Partial<Tournament>,
  bannerFile: File,
  creatorId: string,
  slug?: string,
) => {
  if (!creatorId) {
    return { error: 'You must be signed in.' };
  }
  console.log(slug);

  const request = await fetch(
    !slug ? '/api/tournament/create' : `/api/tournament/${slug}/update`,
    {
      method: 'POST',
      body: JSON.stringify({
        name: t.name,
        format: t.format,
        startDate: dayjs(t.startDate).toISOString(),
        createdBy: creatorId,
        slug: t.slug,
        game: 'VALORANT',
        maxRegistrants: t.maxRegistrants,
        mainStream: t.mainStream,
        roundWinConditions: t.roundWinConditions,
        bannerFileType: bannerFile ? encodeURIComponent(bannerFile.type) : null,
        description: t.description,
      }),
    },
  );

  const {
    tournament,
    post,
  }: {
    tournament: Tournament;
    post: { fields: PresignedPost.Fields; url: string } | null;
  } = await request.json();

  if (bannerFile && post) {
    // rename to file here because Jeff wants it that way
    const file = bannerFile;
    const formData = new FormData();
    Object.entries({ ...post.fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const bannerUpload = await fetch(post.url, {
      method: 'POST',
      body: formData,
    });

    if (bannerUpload.status !== 204) {
      return {
        error: 'There was a problem uploading your banner to our server.',
      };
    }
  }

  if (request.status !== 200 || !tournament) {
    console.log(tournament);
    // console.log(request.status, tournament)
    return { error: 'something went wrong' };
  }
  return { success: true, slug: `/${tournament.slug}` };
};

export const convertTitleToSlug = (title: string) => {
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  return slug;
};

export const countTotalRounds = (totalPlayers: string) => {
  const players = parseInt(totalPlayers, 10);
  let roundMatches = players / 2;
  let totalRounds = 1;
  const addRound = () => {
    if (roundMatches % 2 === 0) {
      roundMatches /= 2;
      totalRounds += 1;
      addRound();
    }
  };
  addRound();

  return totalRounds;
};
