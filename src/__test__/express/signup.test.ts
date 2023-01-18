import axios from 'axios';

// The function we want to test
async function signUpApi(data: any) {
    try {
        const response: any = await axios.post("https://cashgps-staging.fly.dev/auth/signup", {
            ...data,
        });
        return response.data.signupResult;
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
                signupResult: {
                    currency: "USD",
                    email: "chau123@gmail.com",
                    firstName: "van",
                    googleId: null,
                    id: "270",
                    lastName: "chau",
                    timezone: "UTC±00:00"
                }
            }
        });

        // The data we want to send in the request
        const formSignUp = {
            firstName: 'van',
            lastName: 'chau',
            email: 'gmail',
            password: 'chau1234',
            confirmPassword: 'chau1234',
            letterEmail: false,
            agree: false,
        }
        // Call the function and save the result
        const result = await signUpApi(formSignUp);

        // Verify that the function made the correct API call
        expect(axios.post).toHaveBeenCalledWith('https://cashgps-staging.fly.dev/auth/signup', formSignUp);

        // Verify that the function returned the expected result
        expect(result).toEqual(
            {
                currency: "USD",
                email: "chau123@gmail.com",
                firstName: "van",
                googleId: null,
                id: "270",
                lastName: "chau",
                timezone: "UTC±00:00"
            }
        );
    });
});