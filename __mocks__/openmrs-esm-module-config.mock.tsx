import React from "react";

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn()
};

export const validator = () => {};

export function useConfig() {
  return {
    patientDash: {
      spa: false,
      url: "/pt-dash/${patientId}"
    },
    visitPage: {
      spa: false,
      url: "/visit/${visitUuid}"
    }
  };
}

export const ModuleNameContext = React.createContext("fake-module-config");
