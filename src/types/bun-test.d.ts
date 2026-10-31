declare module "bun:test" {
  export const describe: (name: string, callback: () => void) => void;
  export const test: (
    name: string,
    callback: () => void | Promise<void>,
  ) => void;
  interface Matchers {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toContain(expected: unknown): void;
    toMatchObject(expected: object): void;
    toBeInstanceOf(expected: unknown): void;
    not: Matchers;
    rejects: Matchers;
  }
  export const expect: (actual: unknown) => Matchers;
}
