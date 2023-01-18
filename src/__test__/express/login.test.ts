import axios from 'axios';

// The function we want to test
async function postAPI(data: any) {
    try {
        const response: any = await axios.post("https://cashgps-staging.fly.dev/auth/login", {
            ...data,
        });
        return response.data.loginResult.profile;
    } catch (error) {
        throw error;
    }
}

// The test case
describe('function login API', () => {
    it('should return a object have infomation of user after login successfully!', async () => {
        // Mock the axios.post function using Jest's `jest.fn`
        axios.post = jest.fn().mockResolvedValue({
            data: {
                loginResult: {
                    profile: {
                        activeSubscription: "TRIAL",
                        currency: "VND",
                        email: "duc@nelisoftwares.com",
                        firstName: "chau",
                        hasProject: true,
                        isEmailVerified: true,
                        lastName: "nguyen van"
                    }
                }
            }
        });

        // The data we want to send in the request
        const formLogin = {
            email: 'duc@nelisoftwares.com',
            password: '232323',
        }
        // Call the function and save the result
        const result = await postAPI(formLogin);

        // Verify that the function made the correct API call
        expect(axios.post).toHaveBeenCalledWith('https://cashgps-staging.fly.dev/auth/login', formLogin);

        // Verify that the function returned the expected result
        expect(result).toEqual(
            {
                activeSubscription: "TRIAL",
                currency: "VND",
                email: "duc@nelisoftwares.com",
                firstName: "chau",
                hasProject: true,
                isEmailVerified: true,
                lastName: "nguyen van"
            }
        );
    });
});