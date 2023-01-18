import "@testing-library/jest-dom";
import { GraphQLClient } from 'graphql-request';

test('test UPDATE_NAME mutation', async () => {
    const client = new GraphQLClient('https://cashgps-staging.fly.dev/graphql', {
        headers: {
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjYiLCJlbWFpbCI6ImR1Y0BuZWxpc29mdHdhcmVzLmNvbSIsImlhdCI6MTY3MjA0NTYwOCwiZXhwIjoxNjc0NjM3NjA4fQ.V0BTszbnGZktJrp1DEHjvwJDGr8Y5PsrbT3zW8uycSI',
        },
    });
    const mutation = `
  mutation changeName($firstName: String, $lastName: String) {
    updateUserProfile(firstName: $firstName, lastName: $lastName) {
      email
    }
  }
  `;

    const variables = {
        firstName: "van",
        lastName: "chau",
    };

    const expectedData = {
        data: {
            updateUserProfile: {
                email: "duc@nelisoftwares.com"
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
