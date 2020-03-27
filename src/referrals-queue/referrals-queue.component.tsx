import React from "react";
import { useConfig } from "@openmrs/esm-module-config";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { Trans } from "react-i18next";
import styles from "./referrals-queue.css";
import { getReferrals } from "./referrals-queue.resource";

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

  return (
    <div className="omrs-main-content">
      <div className={styles.greeting}>
        <Trans i18nKey="referrals-queue">Referrals Queue</Trans>
      </div>
      <div>
        <table>
          <thead>
            <tr className="omrs-bold">
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
                    <tr>
                      <td>{referral.zl_emr_id}</td>
                      <td>{referral.patient_name}</td>
                      <td>{referral.referral_date}</td>
                      <td>{referral.referral_type}</td>
                      <td>{referral.status}</td>
                      <td>&nbsp;</td>
                    </tr>
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ReferralsQueueProps = {};
