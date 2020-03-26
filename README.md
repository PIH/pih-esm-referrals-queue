# @pih/esm-referrals-queue

A page for viewing the J9 Home Visits from CommCare

[![Build Status](https://travis-ci.com/pih/pih-esm-referrals-queue.svg?branch=master)](https://travis-ci.com/pih/pih-esm-referrals-queue)

## Design Notes

*Copied from [PIH Confluence](https://pihemr.atlassian.net/wiki/spaces/DSS/pages/538116104/PIH+EMR+Referrals+Queue)*

![design](https://raw.githubusercontent.com/PIH/pih-esm-referrals-queue/master/design-mockup.png)

There should be one row per referral in this list (not one per encounter).  Some encounters may result in multiple referrals.  See the Referral Type logic below.

Note that the basic referrals workflow would be for J9 clinicians/managers to view the list of referrals here, then take action upon them one by one by clicking on the “pending” referrals.  This will bring them into editing the Home Visit form from which the referral came.  From there they specify any action taken on the referral and navigate back to this list. 
