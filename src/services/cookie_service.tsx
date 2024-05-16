import Cookies from 'universal-cookie';

const CookieService = {
  getUserCookie() {
    const cookies = new Cookies();
    return cookies.get('user');
  },

  deleteUserCookie() {
    const cookies = new Cookies();
    cookies.remove('user');
  },
};

export default CookieService;
