import {useEffect, useState} from 'react';
import client from '@/services/api_service';

interface UserDetails {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  githubLink: string;
}

const UserService = {
  useGetUserDetails(url: string, token: string) {
    const [userDetails, setUserDetails] = useState<UserDetails>({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      githubLink: '',
    });
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
            setUserDetails({
              username: '',
              email: '',
              first_name: '',
              last_name: '',
              githubLink: '',
            });
            setIsLoading(false);
          });
    }, [url]);
    return {isLoading, error, userDetails};
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
