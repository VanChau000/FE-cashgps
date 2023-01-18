import { GET_LIST_PROJECT } from "../../../../graphql/Query";


export const setupApiMock = (): any => {};
export const mocks = [
  {
    request: {
      query: GET_LIST_PROJECT,
      variables: {projectId: '111'}
    },
    
    result: {
      data: {
        fetchProject: {
          cashGroup: [[],[]],
          infoProject: {
            currency: "USD",
            currencySymbol: "$",
            initialCashFlow: "2023-01-03",
            projectName: "111",
            startDate: "2023-01-04",
            startingBalance: '11111111',
            timezone: "UTC+12:45",
            weekSchedule: "127",
            __typename: "InfoProjectType"
          },
          ownerActiveSubscription: "MONTHLY BASIC",
          ownerSubscriptionExpiresAt: "2023-02-02",
          permission: null,
          __typename: "FetchProject"
        },
      },
    },
  },
];