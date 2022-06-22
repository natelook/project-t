import type { Tournament } from '@prisma/client';
import type { PresignedPost } from 'aws-sdk/clients/s3';
import dayjs from 'dayjs';

// t = tournament
const createTournament = async (
  t: Partial<Tournament>,
  bannerFile: File,
  creatorId: string,
) => {
  if (!creatorId) {
    return { error: 'You must be signed in.' };
  }

  const request = await fetch('/api/tournament/create', {
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
  });

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
    // console.log(request.status, tournament)
    return { error: 'something went wrong' };
  }
  return { success: true, slug: `/${tournament.slug}` };
};

export default createTournament;
