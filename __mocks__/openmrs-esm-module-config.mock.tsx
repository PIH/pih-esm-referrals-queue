import React from "react";

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn()
};

export const validator = () => {};

export function useConfig() {
  return {
    links: {
      patientDash: {
        spa: false,
        url: "/pt-dash/${patientUuid}"
      },
      visitPage: {
        spa: false,
        url: "/visit/${patientUuid}/${visitUuid}"
      },
      homeVisitForm: {
        spa: false,
        url: "/home-visit-form/${patientUuid}/${visitUuid}/${encounterUuid}"
      }
    },
    pendingStatuses: ["Pending status"]
  };
}

export const ModuleNameContext = React.createContext("fake-module-config");
