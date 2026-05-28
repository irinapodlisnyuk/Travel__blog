// export const BASE_URL = 'https://travelblog.skillbox.cc';

// export const defaultConfig = {
//   headers: {
//     'Content-type': 'application/json; charset=UTF-8'
//   }
// };


export const BASE_URL = import.meta.env.DEV 
  ? '' 
  : 'https://travelblog.skillbox.cc';

export const defaultConfig = {
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
};