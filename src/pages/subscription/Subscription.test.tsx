/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mocks } from './fixtures';
import Subscription from './Subscription';

jest.mock('./fixtures.ts', () => {
  const mApolloClient = { query: jest.fn() };
  return { setupApiMock: jest.fn(() => mApolloClient) };
});

describe("subscription", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  })
  function waitTimeout(ms: number) {
    return new Promise((resolve) => setTimeout(() => resolve(true), ms));
  }

  it('should query and return null data', async () => {
    module.exports = (request: any, response: any) => {
      const userId = request.body.id;
      if (userId === 1) {
        return response.status(409).send({});
      }
      return response.status(201).send({
        data: {
          getUser: {
            hasProject: false,
            user: {
              activeSubscription: "",
              currency: "USD", customerId: "cus_N0zRKayoQTiB6y", email: "cashgps@nelisoftwares.com", firstName: "kevin", googleId: null, id: "219", isEmailVerified: true, lastName: "perard", subscriptionExpiresAt:
                "2023-02-02", timezone: "UTC+12:45", __typename: "User"
            },
            __typename: "GetUser"
          },
        },
      });
    }
  });
  it('renders current subscription', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <Subscription />
      </MockedProvider>,
    );
    jest.runAllTimers();
    await waitTimeout(2000)
    expect(container).toHaveTextContent("Your has been expired");
  });
  it('renders current subscription toggle monthly', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <Subscription />
      </MockedProvider>,
    );
    jest.runAllTimers();
    await waitTimeout(2000)
    await waitFor(() => fireEvent.click(screen.getByTestId('btn-subs-monthly')))
    expect(container).toHaveTextContent("Monthly");
  });

  it('renders current subscription toggle annually', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <Subscription />
      </MockedProvider>,
    );
    jest.runAllTimers();
    await waitTimeout(2000)
    await waitFor(() => fireEvent.click(screen.getByTestId('btn-subs-annually')))
    expect(container).toHaveTextContent("Annually");
  });
});
