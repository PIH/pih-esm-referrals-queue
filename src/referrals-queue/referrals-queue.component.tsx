import React from "react";
import { useConfig } from "@openmrs/esm-module-config";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { Trans } from "react-i18next";
import styles from "./referrals-queue.css";
import { getReferrals } from "./referrals-queue.resource";
import { formatDate, interpolateString } from "../util";
import ConfigurableLink from "../configurable-link/configurable-link";

export default function ReferralsQueue(props: ReferralsQueueProps) {
  const config = useConfig();

  const [referrals, setReferrals] = React.useState([]);

  React.useEffect(() => {
    const sub = getReferrals().subscribe(
      referrals => setReferrals(referrals),
      createErrorHandler()
    );
    return () => sub.unsubscribe();
  }, []);

  console.log(referrals); // eslint-disable-line no-console

  return (
    <div className={`omrs-main-content ${styles.container}`}>
      <div className="omrs-card omrs-margin-top-32 omrs-padding-16">
        <div className={styles.greeting}>
          <Trans i18nKey="referrals-queue">Referrals Queue</Trans>
        </div>
        <div className={styles.tableContainer}>
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
              {referrals &&
                referrals.map((referral, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr className={styles.tr}>
                        <td>
                          <ConfigurableLink
                            label={referral.zl_emr_id}
                            spa={config.links.patientDash.spa}
                            url={interpolateString(
                              config.links.patientDash.url,
                              {
                                patientUuid: referral.person_uuid
                              }
                            )}
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
        </div>
      </div>
    </div>
  );
}

type ReferralsQueueProps = {};
