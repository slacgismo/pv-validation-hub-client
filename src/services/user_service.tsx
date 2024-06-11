import client from '@/services/api_service';
import CookieService from '@/services/cookie_service';

const UserService = {
  getUserDetails(url: string, uname: string) {
    console.log('url: ', url);
    console.log('uname: ', uname);
    let user = uname;
    if (url.includes('/account/public/') !== true) {
      console.error('Invalid URL');
      return '400: Invalid URL';
    }

    if (uname === null || uname === undefined) {
      console.error('No username provided: defaulting to current user');
      user = CookieService.getUserCookie();
      user = user.username;
      if (user === null || user === undefined) {
        console.error('No user found');
        return '400: Invalid username';
      } else {
        return user;
      }
    }

    return client.post(url,
        {username: user});
  },
  async updateUserProfile(token: string, updatedProfile: any) {
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
