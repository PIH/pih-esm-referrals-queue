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
    <div className={styles.greeting}>
      <Trans i18nKey="referrals queue">Referrals Queue</Trans>
      <div>{JSON.stringify(referrals, null, 2)}</div>
    </div>
  );
}

type ReferralsQueueProps = {};
