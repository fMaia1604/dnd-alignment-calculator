import chaoticGood from "./chaoticGood";
import lawfulGood from "./lawfulGood";
import neutralGood from "./neutralGood";
import type { IThemes } from "./utils";

/**
 * The default theme to load
 */
export const DEFAULT_THEME: string = "lawfulGood";

export const themes: IThemes = {
  lawfulGood,
  neutralGood,
  chaoticGood,
};
