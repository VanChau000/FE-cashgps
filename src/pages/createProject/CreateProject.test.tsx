/* eslint-disable testing-library/no-wait-for-side-effects */
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CreateProject from './CreateProject';
import { mocks } from './fixtures';


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
        <CreateProject />
      </MockedProvider>
    );
    expect(container).toHaveTextContent("What’s your project name?");
  });

  it('renders create project', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <CreateProject />
      </MockedProvider>
    );
    expect(container).toHaveTextContent("Step 1 of 2");
  });
  it('renders next step', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <CreateProject />
      </MockedProvider>
    );
    await waitFor(() => fireEvent.change(screen.getByTestId('name-project'), { target: { value: 'abc' } }))
    await waitFor(() => fireEvent.click(screen.getByTestId('btn-next-step')))
    expect(container).toHaveTextContent("Step 2 of 2");
  });
  it('renders currency', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} >
        <CreateProject />
      </MockedProvider>
    );
    await waitFor(() => fireEvent.change(screen.getByTestId('name-project'), { target: { value: 'abc' } }))
    await waitFor(() => fireEvent.click(screen.getByTestId('btn-next-step')))
    await waitFor(() => fireEvent.change(screen.getByTestId('select-currency'), { target: { value: 'AED' } }))
    // await waitFor(() => fireEvent.change(screen.getByTestId('currency-symbol'), { target: { value: 'AED' } }))
    expect(container).toHaveTextContent("AED");

  });
});
