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
    }
  };
}

export const ModuleNameContext = React.createContext("fake-module-config");
