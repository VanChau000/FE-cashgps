/* eslint-disable testing-library/no-wait-for-side-effects */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import '@testing-library/jest-dom/extend-expect';
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  // 3- Import non-mocked library and use other functionalities and hooks
  ...(jest.requireActual("react-router-dom") as any),
  // 4- Mock the required hook
  useNavigate: () => mockedNavigate
}));

describe("Login", () => {
  beforeEach(() => {
    // jest.spyOn(console, "log").mockImplementation(() => { });
    // mockedNavigate.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });


  it("form-container-header-title-login", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-login")));
    expect(container).toHaveTextContent("Email address");
    //input wrong type email
    await waitFor(() => fireEvent.change(screen.getByTestId('input-email'), { target: { value: "123" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('input-password'), { target: { value: "dsa" } }))
    await waitFor(() => fireEvent.click(screen.getByTestId("btn-login")));
    expect(container).toHaveTextContent("Password must be more 5 characters");
  });
  it("form-container-login-wrong-pass", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-login")));
    expect(container).toHaveTextContent("Email address");
    //input wrong type email
    await waitFor(() => fireEvent.change(screen.getByTestId('input-email'), { target: { value: "caoducanh280698@gmail.com" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('input-password'), { target: { value: "123abc" } }))
    await waitFor(() => fireEvent.click(screen.getByTestId("btn-login")));
    expect(container).toHaveTextContent("Log in with GoogleNew to CashGPS");
  });

  it("form-container-login-fail-email", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-login")));
    expect(container).toHaveTextContent("Email address");
    //input wrong type email
    await waitFor(() => fireEvent.change(screen.getByTestId('input-email'), { target: { value: "cashgps@" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('input-password'), { target: { value: "abc123$$" } }))
    await waitFor(() => fireEvent.click(screen.getByTestId("btn-login")));
    expect(container).toHaveTextContent("Log in with GoogleNew to CashGPS");
  });
  it("form-container-login-fail-password", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-login")));
    expect(container).toHaveTextContent("Email address");
    //input wrong type email
    await waitFor(() => fireEvent.change(screen.getByTestId('input-email'), { target: { value: "cashgps@nelisoftwares.com" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('input-password'), { target: { value: "abc12" } }))
    await waitFor(() => fireEvent.click(screen.getByTestId("btn-login")));
    expect(container).toHaveTextContent("Log in with GoogleNew to CashGPS");
  });

  it("form-container-login-success", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-login")));
    expect(container).toHaveTextContent("Email address");
    //input wrong type email
    await waitFor(() => fireEvent.change(screen.getByTestId('input-email'), { target: { value: "cashgps@nelisoftwares.com" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('input-password'), { target: { value: "abc123$$" } }))
    await waitFor(() => fireEvent.click(screen.getByTestId("btn-login")));
    expect(global.window.location.pathname).toContain('/');
  });

  //title-signup
  it("form-container-header-title-signup", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-signup")));
    expect(container).toHaveTextContent("Confirm password");
  });

  it("form-container-header-title-signup-input-fail", async () => {
    const { container } = render(
      <Login />
    );
    await waitFor(() => fireEvent.click(screen.getByTestId("title-signup")));
    await waitFor(() => fireEvent.change(screen.getByTestId('firstname-test'), { target: { value: "" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('lastname-test'), { target: { value: "" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('email-test'), { target: { value: "" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('pass-test'), { target: { value: "" } }))
    await waitFor(() => fireEvent.change(screen.getByTestId('passConfirm-test'), { target: { value: "" } }))
    expect(container).toHaveTextContent("Confirm password");
  });

});
