export const UNDERDOG_PROTOCOL_LOGOS_URL =
  "https://storage.googleapis.com/underdog-protocol/logos";

export const PUBLIC_LOGO_URL = `${UNDERDOG_PROTOCOL_LOGOS_URL}/public/icon.svg`;
export const SOLARPLEX_LOGO_URL = `${UNDERDOG_PROTOCOL_LOGOS_URL}/solarplex/icon.svg`;
export const SPORTING_LOGO_URL = `${UNDERDOG_PROTOCOL_LOGOS_URL}/sporting/icon.png`;
export const UNDERDOG_LOGO_URL = `${UNDERDOG_PROTOCOL_LOGOS_URL}/icon_dark.svg`;

export const apps: Record<string, { title: string; src: string }> = {
  public: {
    title: "Public",
    src: PUBLIC_LOGO_URL,
  },
  solarplex: {
    title: "Solarplex",
    src: SOLARPLEX_LOGO_URL,
  },
  sporting: {
    title: "Sporting",
    src: SPORTING_LOGO_URL,
  },
  underdog: {
    title: "Underdog",
    src: UNDERDOG_LOGO_URL,
  },
};
