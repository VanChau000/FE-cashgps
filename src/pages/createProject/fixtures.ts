import { GET_LIST_PROJECT } from "../../graphql/Query";

export const setupApiMock = (): any => {};
export const mocks = [
  {
    request: {
      query: GET_LIST_PROJECT,
      
    },
    result: {
      data: {
        getUser: {
          hasProject: false,
          user: {
            activeSubscription: "MONTHLY BASIC",
            currency: "USD",customerId: "cus_N0zRKayoQTiB6y",email: "cashgps@nelisoftwares.com",firstName: "kevin",googleId: null,id: "219",isEmailVerified: true,lastName: "perard",subscriptionExpiresAt: "2023-02-02",timezone: "UTC+12:45",__typename: "User"
          },
          __typename: "GetUser"
        },
      },
    },
  },
];