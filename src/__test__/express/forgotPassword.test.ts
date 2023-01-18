import axios from 'axios';

// The function we want to test
async function postAPI(data: any) {
    try {
        const response: any = await axios.post('https://cashgps-staging.fly.dev/auth/forgot/password', data);
        return response.forgotPassword.message;
    } catch (error) {
        throw error;
    }
}

// The test case
describe('function forgot password API', () => {
    it('should return a message success', async () => {
        // Mock the axios.post function using Jest's `jest.fn`
        axios.post = jest.fn().mockResolvedValue({
            forgotPassword: {
                message: "Check your email or spam to get the new password!"
            }
        });

        // The data we want to send in the request
        const email = 'chau@gmail.com'
        // Call the function and save the result
        const result = await postAPI(email);

        // Verify that the function made the correct API call
        expect(axios.post).toHaveBeenCalledWith('https://cashgps-staging.fly.dev/auth/forgot/password', email);

        // Verify that the function returned the expected result
        expect(result).toEqual(
            "Check your email or spam to get the new password!"
        );
    });
});