import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Table from "./TableLayout";
import { listCashPerBasedOnWeeksOfMonth, totalCashPerDay, useFor } from "./fixtures";

beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => { });
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.resetAllMocks();
  jest.clearAllMocks();
});

it("click img open toggle", async () => {
  render(<Table totalCashPerDay={totalCashPerDay} listCashPerBasedOnWeeksOfMonth={listCashPerBasedOnWeeksOfMonth} useFor={useFor} />);
  fireEvent.click(screen.getByTestId("img-toggle"));
});