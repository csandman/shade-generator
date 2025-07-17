import type { ColorInfo } from 'utils/color';

export type BodyNumber = 1 | 2;

export type ColorCallback = (
  color: ColorInfo | string,
  colorNum: BodyNumber,
) => void;
