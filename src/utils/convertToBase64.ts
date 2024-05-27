import RNFetchBlob from 'rn-fetch-blob';

export const converToBase64 = async ({
  uri,
  mimeType,
}: {
  uri: string;
  mimeType: string;
}) => {
  const response = await RNFetchBlob.fs.readFile(uri, 'base64');
  return `data:${mimeType};base64,${response}`;
};
