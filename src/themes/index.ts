import chaoticEvil from "./chaoticEvil";
import chaoticGood from "./chaoticGood";
import chaoticNeutral from "./chaoticNeutral";
import lawfulEvil from "./lawfulEvil";
import lawfulGood from "./lawfulGood";
import lawfulNeutral from "./lawfulNeutral";
import neutralEvil from "./neutralEvil";
import neutralGood from "./neutralGood";
import trueNeutral from "./trueNeutral";
import type { IThemes } from "./utils";

/**
 * The default theme to load
 */
export const DEFAULT_THEME: string = "lawfulGood";

export const themes: IThemes = {
  lawfulGood,
  neutralGood,
  chaoticGood,
  lawfulNeutral,
  trueNeutral,
  chaoticNeutral,
  lawfulEvil,
  neutralEvil,
  chaoticEvil,
};
