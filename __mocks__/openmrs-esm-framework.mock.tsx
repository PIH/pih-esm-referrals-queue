import React from "react";
import { of } from "rxjs";

export function openmrsFetch() {
  return new Promise(() => {});
}

export function openmrsObservableFetch() {
  return of({ data: { entry: [] } });
}

export function getCurrentUser() {
  return of({ authenticated: false });
}

export function createErrorHandler() {
  return function errorHandler(err) {
    // eslint-disable-next-line no-console
    console.log(`Received error ${err}`);
  };
}

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn()
};

export const validator = () => {};

export function useConfig() {
  return {
    links: {
      patientDash: "${openmrsBase}/pt-dash/${patientUuid}",
      visitPage: "${openmrsBase}/visit/${patientUuid}/${visitUuid}",
      homeVisitForm:
        "${openmrsBase}/home-visit-form/${patientUuid}/${visitUuid}/${encounterUuid}"
    },
    pendingStatuses: ["Pending status"]
  };
}

export const ModuleNameContext = React.createContext("fake-module-config");

export function interpolateString(template: string, params: object): string {
  const names = Object.keys(params);
  return names.reduce(
    (prev, curr) => prev.split("${" + curr + "}").join(params[curr]),
    template
  );
}

export const ConfigurableLink = ({ to, children, ...otherProps }) => (
  <a
    onClick={() => {
      window.location.href = interpolateString(to, { openmrsBase: "/openmrs" });
    }}
    href={to}
    {...otherProps}
  >
    {children}
  </a>
);
