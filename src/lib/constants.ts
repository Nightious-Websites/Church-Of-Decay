export const GAME_URL: string =
  import.meta.env.VITE_GAME_URL ?? 'https://www.roblox.com/games/5053514572/The-Bonelands';

export const WHISPERS: readonly string[] = [
  'the veil is thin tonight',
  'all flesh returns to the earth',
  'come, faithful, come',
  'the dead walk among us',
  'give yourself to the rot',
  'kneel before the skull of the dead god',
  'something beneath the stones is breathing',
  'do not count the candles',
  'he remembers your name',
  'the red floor is still wet',
];

export const FAKE_NAMES_LEFT: readonly string[] = [
  'Brother Ash',
  'Sister Caela',
  'Tomas, hollow',
  'Ninth Rot',
  'Hesper of Wax',
  'The Nameless III',
  'Orin Low-Chant',
];

export const FAKE_NAMES_RIGHT: readonly string[] = [
  'Merrow-Teeth',
  'Black-cloak Ilya',
  'The twice-signed',
  'Dagen, bone-keep',
  'Sister Rue',
];

// Indices into FAKE_NAMES_* marked with the .old class for weathering effect.
export const OLD_INDICES_LEFT: readonly number[] = [1, 4, 6];
export const OLD_INDICES_RIGHT: readonly number[] = [2];
