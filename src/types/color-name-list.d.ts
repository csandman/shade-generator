declare module 'color-name-list' {
  interface ColorName {
    name: string;
    hex: string;
  }

  export const colornames: ColorName[];
}
