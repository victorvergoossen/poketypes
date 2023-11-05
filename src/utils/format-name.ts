export const formatName = (name: string) =>
  name.toLowerCase()?.replace("-", '')?.split(' ')?.[0];