export type ParsedURL = [string, string, boolean];

export interface UrlState {
  hex1?: string;
  hex2?: string;
}

export const parseURL = (): ParsedURL => {
  const path = window.location.pathname.slice(1);
  if (path.length) {
    const splitUrl = window.location.pathname.slice(1).toUpperCase().split('-');

    if (splitUrl.length === 1 && splitUrl[0].match(/^[0-9A-F]{6}$/)) {
      return [`#${splitUrl[0]}`, '', false];
    }
    if (
      splitUrl.length === 2 &&
      splitUrl[0].match(/^[0-9A-F]{6}$/) &&
      splitUrl[1].match(/^[0-9A-F]{6}$/)
    ) {
      return [`#${splitUrl[0]}`, `#${splitUrl[1]}`, true];
    }
    window.history.pushState({}, 'Shade Generator', '');
  }

  return ['', '', false];
};
