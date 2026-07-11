declare module "bun:test" {
  export const describe: (name: string, callback: () => void) => void;
  export const test: (name: string, callback: () => void | Promise<void>) => void;
  export const expect: (actual: unknown) => {
    toBe(expected: unknown): void;
    toContain(expected: unknown): void;
    toMatchObject(expected: object): void;
  };
}
