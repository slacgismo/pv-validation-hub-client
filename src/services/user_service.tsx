import {useEffect, useState} from 'react';
import client from './api_service.js';

const UserService = {
  useGetUserDetails(url: string, token: string) {
    const [userDetails, setUserDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // set authorization token
    client.defaults.headers.common.Authorization = `Token ${token}`;

    // set request
    useEffect(() => {
      client.get(url)
          .then((response) => {
            setUserDetails(response.data);
            setIsLoading(false);
          })
          .catch((responseError) => {
            setError(responseError);
            setUserDetails({});
            setIsLoading(false);
          });
    }, [url]);
    return [isLoading, error, userDetails];
  },
  async updateUserProfile(token: string, updatedProfile: any) {
    const url = '/account';
    // set authorization token
    client.defaults.headers.common.Authorization = `Token ${token}`;

    const response = await client.put(url, updatedProfile);
    return response.data;
  },
  register(username: string, email: string,
      password: string, firstName: string, lastName: string) {
    const url = '/register';
    client.post(url, {
      username,
      email,
      password,
      firstName,
      lastName,
    }).then((response) => response).catch((error) => console.error(error));
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
