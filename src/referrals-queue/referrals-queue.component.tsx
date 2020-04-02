import React from "react";
import { createErrorHandler } from "@openmrs/esm-error-handling";
import { Trans } from "react-i18next";
import Table from "../table/table.component";
import styles from "./referrals-queue.css";
import { getReferrals } from "./referrals-queue.resource";

export default function ReferralsQueue(props: ReferralsQueueProps) {
  const [referrals, setReferrals]: [Referral[], Function] = React.useState([]);
  const [referralType, setReferralType] = React.useState("");

  React.useEffect(() => {
    const sub = getReferrals().subscribe(
      referrals => setReferrals(referrals),
      createErrorHandler()
    );
    return () => sub.unsubscribe();
  }, []);

  // console.log(referrals);

  const filteredReferrals = referrals.filter(
    r => !referralType || r.referral_type == referralType
  );
  const referralTypes = [...new Set(referrals.map(r => r.referral_type))];
  return (
    <div className={`omrs-main-content ${styles.container}`}>
      <div className="omrs-card omrs-margin-top-32 omrs-padding-16">
        <div className={styles.greeting}>
          <Trans i18nKey="referrals-queue">Referrals Queue</Trans>
        </div>
        <div>
          <label>
            <Trans i18nKey="referrals-queue">Referral Type</Trans>
            <select
              value={referralType}
              onChange={e => setReferralType(e.target.value)}
            >
              <option value="">Any</option>
              {referralTypes.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.tableContainer}>
          <Table referrals={filteredReferrals} />
        </div>
      </div>
    </div>
  );
}

type ReferralsQueueProps = {};
