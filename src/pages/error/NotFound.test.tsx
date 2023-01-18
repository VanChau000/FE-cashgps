/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { render, } from '@testing-library/react';
import NotFound from './NotFound';


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


describe("create-project", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should render without error', async () => {
    const { container } = render(
      <MockedProvider mocks={[]} >
        <NotFound />
      </MockedProvider>
    );
    expect(container).toHaveTextContent("404 - page not found");
  });

});
