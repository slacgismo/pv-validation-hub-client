import client from '@/services/api_service';
import CookieService from '@/services/cookie_service';

const UserService = {
  getUserDetails(url: string, uname: string) {
    console.log('url: ', url);
    console.log('uname: ', uname);
    let user = {
      username: uname,
    };
    if (url.includes('/account/public/') !== true) {
      console.error('Invalid URL');
      throw new Error('Client: Invalid URL');
    }

    if (uname === null || uname === undefined) {
      console.error('No username provided: defaulting to current user');
      user = CookieService.getUserCookie();
      if (user.username === null || user.username === undefined) {
        console.error('No user found');
        throw new Error('Client: Invalid username');
      }
    }

    return client.post(url,
        {username: user.username});
  },
  async updateUserProfile(
      token: string,
      updatedProfile: any,
      urlUpdate: string) {
    const url = '/account';
    // set authorization token
    client.defaults.headers.common.Authorization = `Token ${token}`;

    const response = await client.put(url, updatedProfile);
    return response.data;
  },
  register(username: string, email: string,
      password: string, firstName: string, lastName: string,
      acceptTerms: boolean) {
    const url = '/register';
    client.post(url, {
      username,
      email,
      password,
      firstName,
      lastName,
      acceptTerms,
    }).then((response) => {
      return response.data.token;
    }).catch((error) => console.error(error));
  },
  getUserId(token: string) {
    // Set the authorization token
    client.defaults.headers.common.Authorization = `Token ${token}`;

    // Send a GET request to the '/user_id' endpoint
    return client.get('/user_id')
        .then((response) => response.data.user_id);
  },
};

export default UserService;
