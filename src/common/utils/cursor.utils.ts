export const encodeCursor = (value: string): string => {
  return Buffer.from(`cursor:${value}`).toString('base64');
};

export const decodeCursor = (encoded: string): string => {
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  return decoded.replace('cursor:', '');
};
