import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import ReferralsQueue from "./referrals-queue.component";
import { getReferrals } from "./referrals-queue.resource";
import { of } from "rxjs";

jest.mock("./referrals-queue.resource");
const mockedGetReferrals = getReferrals as jest.Mock;

const referrals = [
  {
    person_uuid: "ptaaaaaa-2869-41a4-86af-811fa2ee65b8",
    zl_emr_id: "PTID1",
    patient_name: "Patient Commcare",
    referral_date: "2020-03-25T00:00:00.000-0400",
    details: null,
    visit_uuid: "visitaaa-091a-46fd-a442-2a9778d91a52",
    encounter_id: 259719,
    referral_type: "Tetanus Vaccination",
    encounter_uuid: "encounter-0fe1-4318-95a4-641d31745e09"
  },
  {
    person_uuid: "ptbbbbbb-de0e-489f-b4c7-fe4579e07aa9",
    zl_emr_id: "PTID2",
    patient_name: "Davina Mother",
    referral_date: "2020-03-23T00:00:00.000-0400",
    details: "Suspected depression",
    visit_uuid: "visitbbb-64ca-4d53-9024-574a9214f76e",
    encounter_id: 259222,
    referral_type: "Mental Health",
    encounter_uuid: "encounter-d5cb-4f7e-a1aa-bd6741a96381"
  }
];

(window as any).openmrsBase = "/openmrs";
// hack around js-dom to make navigation testable
delete window.location;
//@ts-ignore
window.location = { href: "/referrals-queue" };

describe("referrals queue", () => {
  const RealDate = Date;

  function mockDate(isoDate) {
    //@ts-ignore
    global.Date = class extends RealDate {
      //@ts-ignore
      constructor(...args) {
        if (!args) {
          return new RealDate(isoDate);
        } else {
          //@ts-ignore
          return new RealDate(...args);
        }
      }
    };
  }

  let wrapper;
  beforeEach(() => {
    mockDate("2020-04-20T00:00:00.000-0400");
    mockedGetReferrals.mockReset();
    mockedGetReferrals.mockReturnValue(of(referrals));
    //@ts-ignore
    wrapper = render(<ReferralsQueue />);
  });

  it("renders without failing", () => {
    // in beforeEach
  });

  it("renders the expected fields", () => {
    for (let referral of referrals) {
      wrapper.getByText(referral.zl_emr_id);
      wrapper.getByText(referral.patient_name);
      wrapper.getByText(referral.referral_type);
      if (referral.details) {
        wrapper.getByText(referral.details);
      }
    }
    wrapper.getByText("24 Mar"); // funny -- due to TZ it shows the day before?
    wrapper.getByText("22 Mar");
  });

  it("navigates to the links", async () => {
    const pt0DashLink = wrapper.getByText(referrals[0].zl_emr_id);
    fireEvent.click(pt0DashLink);
    await wait(() => {
      expect(window.location.href).toBe(
        "/openmrs/pt-dash/" + referrals[0].person_uuid
      );
    });
    const pt1VisitLink = wrapper.getByText("22 Mar");
    fireEvent.click(pt1VisitLink);
    await wait(() => {
      expect(window.location.href).toBe(
        `/openmrs/visit/${referrals[1].person_uuid}/${referrals[1].visit_uuid}`
      );
    });
  });
});
