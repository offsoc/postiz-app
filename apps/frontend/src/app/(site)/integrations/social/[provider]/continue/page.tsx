import { HttpStatusCode } from 'axios';

export const dynamic = 'force-dynamic';

import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
import { redirect } from 'next/navigation';

export default async function Page({
  params: { provider },
  searchParams,
}: {
  params: { provider: string };
  searchParams: any;
}) {
  if (provider === 'x') {
    searchParams = {
      ...searchParams,
      state: searchParams.oauth_token || '',
      code: searchParams.oauth_verifier || '',
      refresh: searchParams.refresh || '',
    };
  }

  if (provider === 'discord') {
    searchParams = {
      ...searchParams,
      code: searchParams.code + ':' + searchParams.guild_id,
    };
  }

  const data = await internalFetch(`/integrations/social/${provider}/connect`, {
    method: 'POST',
    body: JSON.stringify(searchParams),
  });

  console.log(data.status);

  if (data.status === HttpStatusCode.NotAcceptable) {
    return redirect(`/launches?scope=missing`);
  }

  const { inBetweenSteps, id } = await data.json();

  if (inBetweenSteps && !searchParams.refresh) {
    return redirect(`/launches?added=${provider}&continue=${id}`);
  }

  return redirect(`/launches?added=${provider}`);
}
