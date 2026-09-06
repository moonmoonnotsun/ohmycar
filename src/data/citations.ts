export type Citation = { label: string; url: string };

const wiki = (page: string, label: string): Citation => ({
  label,
  url: `https://en.wikipedia.org/wiki/${page}`,
});

export const cite = {
  n47: [
    wiki("BMW_N47", "Wikipedia · BMW N47"),
    { label: "EngineScope N47 (competitor, not our score)", url: "https://enginescope.com" },
  ],
  n54: [
    {
      label: "NHTSA · N54 HPFP warranty TSB (SI B13 04 09 / MC-10149587)",
      url: "https://static.nhtsa.gov/odi/tsbs/2013/MC-10149587-9999.pdf",
    },
    wiki("BMW_N54", "Wikipedia · BMW N54"),
  ],
  n53: [wiki("BMW_N53", "Wikipedia · BMW N53")],
  n43: [wiki("BMW_N43", "Wikipedia · BMW N43")],
  n52: [wiki("BMW_N52", "Wikipedia · BMW N52")],
  m47: [wiki("BMW_M47", "Wikipedia · BMW M47")],
  m57: [wiki("BMW_M57", "Wikipedia · BMW M57")],
  n57: [wiki("BMW_N57", "Wikipedia · BMW N57")],
  n46: [wiki("BMW_N46", "Wikipedia · BMW N46")],
  e90: [wiki("BMW_3_Series_(E90)", "Wikipedia · BMW 3 Series (E90)")],
  n20: [
    {
      label: "NHTSA · N20/N26 timing-chain warranty (SI B11 03 17 / MC-10142923)",
      url: "https://static.nhtsa.gov/odi/tsbs/2017/MC-10142923-9999.pdf",
    },
    wiki("BMW_N20", "Wikipedia · BMW N20"),
  ],
  m54: [wiki("BMW_M54", "Wikipedia · BMW M54")],
  n62: [wiki("BMW_N62", "Wikipedia · BMW N62")],
  b47: [wiki("BMW_B47", "Wikipedia · BMW B47")],
  n13: [wiki("BMW_N13", "Wikipedia · BMW N13")],
  e39: [wiki("BMW_5_Series_(E39)", "Wikipedia · BMW 5 Series (E39)")],
  xdrive: [wiki("BMW_xDrive", "Wikipedia · BMW xDrive")],
} as const satisfies Record<string, Citation[]>;
