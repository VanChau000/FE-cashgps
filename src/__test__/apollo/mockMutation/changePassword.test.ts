import "@testing-library/jest-dom";
import { GraphQLClient } from 'graphql-request';


test('test UPDATE_PASSWORD mutation', async () => {
    const client = new GraphQLClient('https://cashgps-staging.fly.dev/graphql', {
        headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjYiLCJlbWFpbCI6ImR1Y0BuZWxpc29mdHdhcmVzLmNvbSIsImlhdCI6MTY3MjA0NTYwOCwiZXhwIjoxNjc0NjM3NjA4fQ.V0BTszbnGZktJrp1DEHjvwJDGr8Y5PsrbT3zW8uycSI',
        },
    });
    const mutation = `
    mutation changePassword($updatePasswordArgs: UpdatePasswordInput) {
        changePassword(updatePasswordArgs: $updatePasswordArgs) {
          message
        }
      }
  `;

    const variables = {
        updatePasswordArgs: {
            currentPassword: "232323",
            newPassword: "Test0101",
            newPasswordConfirm: "Test0101",
        },
    };

    const expectedData = {
        data: {
            changePassword: {
                message: "Change password successfully"
            }
        },
    };

    try {
        const response = await client.request(mutation, variables);
        expect(response).toEqual(expectedData);
    } catch (error: any) {
        expect(error).toEqual(error);
    }
});
