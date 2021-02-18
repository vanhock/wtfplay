export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getYear = (dateObject: any) => {
  const dateString = dateObject && dateObject.date;
  const m = dateString.match(/(\d{4}|\d{4}\d{4})$/g) || [];
  return (m[0] && parseInt(m[0])) || 0;
};

export const removeDuplicates = (data:any) => data.reduce((acc: any, current: any) => {
  const x = acc.find((item: any) => item.steam_appid === current.steam_appid);
  if (!x) {
    return acc.concat([current]);
  } else {
    return acc;
  }
}, []);

export const isMultiplayer = (data: any) =>
    data && data.categories && data.categories.some((c: { id: number }) => c.id === 1 || c.id === 38);
