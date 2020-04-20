import React from "react";
import { of } from "rxjs";
import { render, fireEvent, wait, RenderResult } from "@testing-library/react";
import MockDate from "mockdate";
import ReferralsQueue from "./referrals-queue.component";
import { getReferrals } from "./referrals-queue.resource";
import ConfigurableLink from "../configurable-link/configurable-link";

jest.mock("./referrals-queue.resource");
const mockedGetReferrals = getReferrals as jest.Mock;

const referrals = [
  {
    patient_uuid: "ptaaaaaa-2869-41a4-86af-811fa2ee65b8",
    zl_emr_id: "PTID1",
    patient_name: "Patient Commcare",
    referral_date: "2020-03-25T00:00:00.000-0400",
    details: null,
    visit_uuid: "visitaaa-091a-46fd-a442-2a9778d91a52",
    encounter_id: 12,
    referral_type: "Test Referral Type",
    encounter_uuid: "encounter-0fe1-4318-95a4-641d31745e09",
    fulfillment_status: null
  },
  {
    patient_uuid: "ptbbbbbb-de0e-489f-b4c7-fe4579e07aa9",
    zl_emr_id: "PTID2",
    patient_name: "Davina Mother",
    referral_date: "2020-03-23T00:00:00.000-0400",
    details: "Suspected depression",
    visit_uuid: "visitbbb-64ca-4d53-9024-574a9214f76e",
    encounter_id: 13,
    referral_type: "Mental Health",
    encounter_uuid: "encounter-d5cb-4f7e-a1aa-bd6741a96381",
    fulfillment_status: "Pending status"
  },
  {
    person_uuid: "ptcccccc-de0e-489f-b4c7-fe4579e07aa9",
    zl_emr_id: "PTID3",
    patient_name: "Patient Prenatal",
    referral_date: "2020-03-28T00:00:00.000-0400",
    details: "Urgent",
    visit_uuid: "visitccc-64ca-4d53-9024-574a9214f76e",
    encounter_id: 14,
    referral_type: "Family Member",
    encounter_uuid: "encounter-67bc-435d-9929-670a98cefe4e",
    fulfillment_status: "Completed"
  }
];

(window as any).openmrsBase = "/openmrs";
// hack around js-dom to make navigation testable
delete window.location;
//@ts-ignore
window.location = { href: "/referrals-queue" };

describe("referrals queue", () => {
  let wrapper: RenderResult;
  const todayString = "2020-10-31";
  beforeEach(() => {
    MockDate.set(todayString + "T10:00:00.000-0400");
    mockedGetReferrals.mockReset();
    mockedGetReferrals.mockReturnValue(of(referrals));
    wrapper = render(<ReferralsQueue />);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it("renders without failing", () => {
    // in beforeEach
  });

  it("renders the expected fields", () => {
    for (let referral of referrals) {
      wrapper.getByText(referral.zl_emr_id);
      wrapper.getByText(referral.patient_name);
      wrapper.getByText(referral.referral_type, { selector: "td" });
      if (referral.details) {
        wrapper.getByText(referral.details);
      }
      if (referral.fulfillment_status) {
        wrapper.getByText(referral.fulfillment_status);
      }
    }
    wrapper.getByText("25 Mar");
    wrapper.getByText("23 Mar");
    wrapper.getByText("28 Mar");
  });

  it("navigates to the links", async () => {
    const pt0DashLink = wrapper.getByText(referrals[0].zl_emr_id);
    fireEvent.click(pt0DashLink);
    await wait(() => {
      expect(window.location.href).toBe(
        "/openmrs/pt-dash/" + referrals[0].patient_uuid
      );
    });
    const pt1VisitLink = wrapper.getByText("23 Mar");
    fireEvent.click(pt1VisitLink);
    await wait(() => {
      expect(window.location.href).toBe(
        `/openmrs/visit/${referrals[1].patient_uuid}/${referrals[1].visit_uuid}`
      );
    });
    const pendingStatusLink = wrapper.getByText("Pending status");
    fireEvent.click(pendingStatusLink);
    await wait(() => {
      expect(window.location.href).toBe(
        `/openmrs/home-visit-form/${referrals[1].patient_uuid}/${referrals[1].visit_uuid}/${referrals[1].encounter_uuid}`
      );
    });
  });

  it("doesn't make non-pending statuses into links", () => {
    expect(wrapper.getByText("Pending status").tagName).toBe("A"); // sanity check
    expect(wrapper.getByText("Completed").tagName).not.toBe("A"); // the actual test
  });

  it("filters by referral type", () => {
    const dropdown = wrapper.getByLabelText("Referral Type", {
      selector: "select"
    });
    fireEvent.change(dropdown, { target: { value: "Mental Health" } });
    expect(wrapper.queryByText("PTID2")).not.toBeNull();
    expect(wrapper.queryByText("PTID1")).toBeNull();
  });

  it("infers list of referral types from data", () => {
    const dropdown = wrapper.getByLabelText("Referral Type", {
      selector: "select"
    });
    fireEvent.change(dropdown, { target: { value: "Test Referral Type" } });
    expect(wrapper.queryByDisplayValue("Test Referral Type")).not.toBeNull();
  });

  it("calls getReferrals with the correct date arguments", () => {
    const monthAgoString = "2020-09-30";
    expect(mockedGetReferrals).lastCalledWith({
      fromDate: monthAgoString,
      toDate: todayString,
      locale: "en"
    });
    const fromDateInput = wrapper.getByLabelText("From");
    fireEvent.change(fromDateInput, { target: { value: "2020-01-01" } });
    expect(mockedGetReferrals).lastCalledWith({
      fromDate: "2020-01-01",
      toDate: todayString,
      locale: "en"
    });
    const toDateInput = wrapper.getByLabelText("To");
    fireEvent.change(toDateInput, { target: { value: "2020-03-01" } });
    expect(mockedGetReferrals).lastCalledWith({
      fromDate: "2020-01-01",
      toDate: "2020-03-01",
      locale: "en"
    });
  });

  it("filters the list of results by patient name query", () => {
    const queryBox = wrapper.getByLabelText("Filter by patient");
    fireEvent.change(queryBox, { target: { value: "Mother" } });
    expect(wrapper.queryByText("PTID2")).not.toBeNull();
    expect(wrapper.queryByText("PTID1")).toBeNull();
  });

  it("filters the list of results by patient name partial token matches", () => {
    const queryBox = wrapper.getByLabelText("Filter by patient");
    fireEvent.change(queryBox, { target: { value: "dav mo" } });
    expect(wrapper.queryByText("PTID2")).not.toBeNull();
    expect(wrapper.queryByText("PTID1")).toBeNull();
  });

  it("filters the list of results by patient id", () => {
    const queryBox = wrapper.getByLabelText("Filter by patient");
    fireEvent.change(queryBox, { target: { value: "ptid1" } });
    expect(wrapper.queryByText("PTID1")).not.toBeNull();
    expect(wrapper.queryByText("PTID2")).toBeNull();
  });

  test.todo("makes the API call with the locale from the user session");
});
