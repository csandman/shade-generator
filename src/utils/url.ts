export type ParsedURL = [string, string, boolean];

export interface UrlState {
  hex1?: string;
  hex2?: string;
}

export const parseURL = (): ParsedURL => {
  const path = globalThis.location.pathname.slice(1);
  if (path.length) {
    const splitUrl = globalThis.location.pathname
      .slice(1)
      .toUpperCase()
      .split('-');

    if (splitUrl.length === 1 && /^[0-9A-F]{6}$/.test(splitUrl[0])) {
      return [`#${splitUrl[0]}`, '', false];
    }
    if (
      splitUrl.length === 2 &&
      /^[0-9A-F]{6}$/.test(splitUrl[0]) &&
      /^[0-9A-F]{6}$/.test(splitUrl[1])
    ) {
      return [`#${splitUrl[0]}`, `#${splitUrl[1]}`, true];
    }
    globalThis.history.pushState({}, 'Shade Generator', '');
  }

  return ['', '', false];
};
