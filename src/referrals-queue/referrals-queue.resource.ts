import { openmrsObservableFetch } from "@openmrs/esm-api";
import { map } from "rxjs/operators";

export function getReferrals({ fromDate, toDate }): Observable<Object[]> {
  return openmrsObservableFetch(
    `/ws/rest/v1/reportingrest/reportdata/cd7dfde7-764a-4da6-81c2-d5887ed1df51?startDate=${fromDate}&endDate=${toDate}&locale=en`
  ).pipe(map(({ data }) => data["dataSets"][0]["rows"]));
}
