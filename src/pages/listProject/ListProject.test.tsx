/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mocks } from './fixtures';
import ListProject from './ListProject';
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  // 3- Import non-mocked library and use other functionalities and hooks
  ...(jest.requireActual("react-router-dom") as any),
  // 4- Mock the required hook
  useNavigate: () => mockedNavigate
}));

jest.mock('./fixtures.ts', () => {
  const mApolloClient = { query: jest.fn() };
  return { setupApiMock: jest.fn(() => mApolloClient) };
});


describe("list-project", () => {
  beforeEach(() => {
    // jest.spyOn(console, "log").mockImplementation(() => { });
    // mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should query and return null data', async () => {
    module.exports = (request: any, response: any) => {
      const userId = request.body.id;
      if (userId === 1) {
        return response.status(409).send({});
      }
      return response.status(201).send({
        listProjects: {
          ownerActiveSubscription: '',
          ownerSubscriptionExpiresAt: '',
          projects: [],
          sharingProjects: [],
        },
      });
    }
  });
  it('renders active Home click', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <ListProject />
      </MockedProvider>,
    );
    await waitFor(() => fireEvent.click(screen.getByTestId('active-home')))
    expect(container).toHaveTextContent("Home");
  });
  it('renders active myProject click', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <ListProject />
      </MockedProvider>,
    );
    await waitFor(() => fireEvent.click(screen.getByTestId('active-myProject')))
    expect(container).toHaveTextContent("My projects");
  });
  it('renders active share click', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <ListProject />
      </MockedProvider>,
    );
    await waitFor(() => fireEvent.click(screen.getByTestId('active-sharing')))
    expect(container).toHaveTextContent("Share");
  });
});
