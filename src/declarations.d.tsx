// This entire file will be deleted once we have typescript definitions
// for @openmrs/esm-api published to npm
declare type Observable<T> = import("rxjs").Observable<T>;

declare module "*.css";

type Referral = {
  details: string;
  encounter_uuid: string;
  encounter_id: number;
  patient_name: string;
  referral_date: string;
  referral_type: string;
  status: string;
  visit_uuid: string;
  zl_emr_id: string;
  fulfillment_status: string;
  patient_uuid?: string;
  person_uuid?: string;
};
