type RedirectSystemPathOptions = {
  initial: boolean;
  path: string;
};

export function redirectSystemPath({ path }: RedirectSystemPathOptions) {
  try {
    const url = new URL(path, 'partyplaner://app');

    if (url.protocol === 'partyplaner:' && url.hostname === 'invite') {
      return `/invite${url.pathname}`;
    }

    return path;
  } catch {
    return '/invite';
  }
}
