/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { render, } from '@testing-library/react';
import { mocks } from './fixture';
import UserSetting from './UserSetting';




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

describe("User setting", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    // mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    render(
      <MockedProvider mocks={[]}>
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
  });

  it('should query and return null data', async () => {
    module.exports = (request: any, response: any) => {
      const userId = request.body.id;
      if (userId === 1) {
        return response.status(409).send({});
      }
      return response.status(201).send({
        data: {
          fetchProject: {
            cashGroup: [[], []],
            infoProject: {
              currency: "",
              currencySymbol: "",
              initialCashFlow: "",
              projectName: "",
              startDate: "",
              startingBalance: '',
              timezone: "",
              weekSchedule: "",
              __typename: "InfoProjectType"
            },
            ownerActiveSubscription: "",
            ownerSubscriptionExpiresAt: "",
            permission: null,
            __typename: "FetchProject"
          },
        },
      });
    }
  });

  it('renders table', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
    expect(container).toHaveTextContent("Net gain");
  });
  it('renders balance', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
    expect(container).toHaveTextContent("week 1Jan 01");
  });
  it('renders cash position', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
    expect(container).toHaveTextContent("Cash position0 0 0 0 0 0");
  });
  it('renders Net gain/loss', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
    expect(container).toHaveTextContent("Net gain/loss0 0 0 0 0 0");
  });
  it('renders Cash inTotal', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
    expect(container).toHaveTextContent("cash in0 0 0 0 0 0");
  });
  it('renders Cash outTotal', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <UserSetting setOpenAccountSetting={() => { }} setEditAccount={() => { }} setIsOpenBilling={() => { }} setBillsHistory={() => { }} setLoading />
      </MockedProvider>,
    );
    expect(container).toHaveTextContent("cash out0 0 0 0 0 0");
  });
});
