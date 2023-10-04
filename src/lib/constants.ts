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
  sphere: {
    title: "Sphere",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/sphere/icon.jpg`,
  },
  superteam: {
    title: "Superteam",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/superteam/icon.png`,
  },
  liquidprop: {
    title: "LiquidProp",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/liquidprop/icon.jpeg`,
  },
  keks: {
    title: "Keks",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/keks/icon.jpeg`,
  },
  urfeed: {
    title: "urfeed",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/urfeed/icon.png`,
  },
  intotheverse: {
    title: "intotheverse",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/intotheverse/icon.png`,
  },
  etherfuse: {
    title: "Etherfuse",
    src: `${UNDERDOG_PROTOCOL_LOGOS_URL}/etherfuse/icon.png`,
  },
  underdog: {
    title: "Underdog",
    src: UNDERDOG_LOGO_URL,
  },
  mail: {
    title: "Mail",
    src: PUBLIC_LOGO_URL,
  },
};
