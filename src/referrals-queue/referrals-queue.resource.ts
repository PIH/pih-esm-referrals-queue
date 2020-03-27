import { openmrsObservableFetch } from "@openmrs/esm-api";
import { map } from "rxjs/operators";

export function getReferrals(): Observable<Object[]> {
  return openmrsObservableFetch(
    `/ws/rest/v1/reportingrest/reportdata/cd7dfde7-764a-4da6-81c2-d5887ed1df51?startDate=2020-01-01&endDate=2020-04-01&locale=en`
  ).pipe(map(({ data }) => data["dataSets"][0]["rows"]));
}
