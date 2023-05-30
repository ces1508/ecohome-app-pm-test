export const isValidUrl = (url: string) => {
  const regex =
    /^((ftp|http|https)?:\/\/)?[^\s\/$.?#]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?[^\s]*$/;
  return regex.test(url);
};
