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
