export const fileExists = (url: string): boolean => {
  const http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
};