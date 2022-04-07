import {CookieJar} from 'tough-cookie';
import axios from 'axios';
import {wrapper} from 'axios-cookiejar-support';

export function newCookieJar() {
  return new CookieJar();
}

export function newAxiosInstance(jar: CookieJar) {
  return wrapper(axios.create({validateStatus: null, jar}));
}
