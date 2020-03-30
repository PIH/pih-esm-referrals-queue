import React from "react";
import { useConfig } from "@openmrs/esm-module-config";
import { Trans } from "react-i18next";
import styles from "./table.css";
import { formatDate, interpolateString } from "../util";
import ConfigurableLink from "../configurable-link/configurable-link";

export default function Table(props: TableProps) {
  const config = useConfig();

  return (
    <table className={styles.table}>
      <thead>
        <tr className={`omrs-bold ${styles.tr}`}>
          <td>
            <Trans i18nKey="emr-id">EMR ID</Trans>
          </td>
          <td>
            <Trans i18nKey="name">Name</Trans>
          </td>
          <td>
            <Trans i18nKey="referral-date">Referral Date</Trans>
          </td>
          <td>
            <Trans i18nKey="referral-type">Referral Type</Trans>
          </td>
          <td>
            <Trans i18nKey="details">Details</Trans>
          </td>
          <td>
            <Trans i18nKey="status">Status</Trans>
          </td>
        </tr>
      </thead>
      <tbody>
        {props.referrals &&
          props.referrals.map((referral, index) => {
            return (
              <React.Fragment key={index}>
                <tr className={styles.tr}>
                  <td>
                    <ConfigurableLink
                      label={referral.zl_emr_id}
                      spa={config.links.patientDash.spa}
                      url={interpolateString(config.links.patientDash.url, {
                        patientUuid: referral.person_uuid
                      })}
                    />
                  </td>
                  <td>{referral.patient_name}</td>
                  <td>
                    <ConfigurableLink
                      label={formatDate(referral.referral_date)}
                      spa={config.links.visitPage.spa}
                      url={interpolateString(config.links.visitPage.url, {
                        patientUuid: referral.person_uuid,
                        visitUuid: referral.visit_uuid
                      })}
                    />
                  </td>
                  <td>{referral.referral_type}</td>
                  <td>{referral.details}</td>
                  <td>&nbsp;</td>
                </tr>
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  );
}

type TableProps = {
  referrals: Referral[];
};

type Referral = {
  details: string;
  encounter_uuid: string;
  encounter_id: number;
  person_uuid: string;
  patient_name: string;
  referral_date: string;
  referral_type: string;
  status: string;
  visit_uuid: string;
  zl_emr_id: string;
};
