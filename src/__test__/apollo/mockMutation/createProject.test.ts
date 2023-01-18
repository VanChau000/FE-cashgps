import "@testing-library/jest-dom";
import { GraphQLClient } from 'graphql-request';


test('test CREATE_NEW_PROJECT mutation', async () => {
  const client = new GraphQLClient('https://cashgps-staging.fly.dev/graphql', {
    headers: {
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNjYiLCJlbWFpbCI6ImR1Y0BuZWxpc29mdHdhcmVzLmNvbSIsImlhdCI6MTY3MjA0NTYwOCwiZXhwIjoxNjc0NjM3NjA4fQ.V0BTszbnGZktJrp1DEHjvwJDGr8Y5PsrbT3zW8uycSI',
    },
  });
  const mutation = `
    mutation createNewProject($upsertProjectArgs: UpsertCashProjectInput) {
      createOrUpdateCashProject(upsertProjectArgs: $upsertProjectArgs) {
        result
      }
    }
  `;

  const variables = {
    upsertProjectArgs: {
      upsertArgs: {
        startingBalance: 2000,
        startDate: '2022-10-10',
        name: 'first project',
        currency: 'USD',
      },
      saturdayOrSunday: [true, false],
    },
  };

  const expectedData = {
    createOrUpdateCashProject: {
      result:
        "Project was inserted",
    },
  };

  const expectErrorSubscription = {
    errors: {
      message: "Upgrade your subscription to perform this action."
    }
  }
  try {
    const response = await client.request(mutation, variables);
    expect(response).toEqual(expectedData);
  } catch (error: any) {
    // handle error
    // expect(error).toEqual(expectErrorSubscription);
    console.log(error.response.errors[0].message);
    expect(error.response.errors[0].message).toEqual("Upgrade your subscription to perform this action.");
  }
});
