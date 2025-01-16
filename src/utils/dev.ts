export const sleep = async (milliseconds: number) =>
  await new Promise((r) => setTimeout(r, milliseconds));
