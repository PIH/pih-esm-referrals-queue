import {
  defineConfigSchema,
  Type,
  validators,
  registerBreadcrumbs,
  getAsyncLifecycle
} from "@openmrs/esm-framework";

const backendDependencies = {};

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

function setupOpenMRS() {
  defineConfigSchema("@pih/esm-referrals-queue-app", {
    links: {
      patientDash: {
        _type: Type.String,
        _default:
          "${openmrsBase}/coreapps/clinicianfacing/patient.page?patientId=${patientUuid}&app=pih.app.clinicianDashboard",
        _validators: [validators.isUrlWithTemplateParameters(["patientUuid"])]
      },
      visitPage: {
        _type: Type.String,
        _default:
          "${openmrsBase}/pihcore/visit/visit.page?patient=${patientUuid}&visit=${visitUuid}&suppressActions=true#/overview",
        _validators: [
          validators.isUrlWithTemplateParameters(["patientUuid", "visitUuid"])
        ]
      },
      homeVisitForm: {
        _type: Type.String,
        _default:
          "${openmrsBase}/htmlformentryui/htmlform/editHtmlFormWithStandardUi.page?patientId=${patientUuid}&visitId=${visitUuid}&encounterId=${encounterUuid}&definitionUiResource=file:configuration/pih/htmlforms/section-mch-referral.xml&returnUrl=/mirebalais/spa/referrals-queue",
        _validators: [
          validators.isUrlWithTemplateParameters([
            "patientUuid",
            "visitUuid",
            "encounterUuid"
          ])
        ]
      }
    },
    pendingStatuses: {
      _type: Type.Array,
      _default: ["Pending status", "Referral unmet"],
      _elements: {
        _type: Type.String
      }
    }
  });

  const moduleName = "@pih/esm-referrals-queue-app";
  const pageName = "referrals-queue";

  const options = {
    featureName: pageName,
    moduleName
  };

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/${pageName}`,
      title: "Referrals Queue"
    }
  ]);

  return {
    lifecycle: getAsyncLifecycle(() => import("./root.component"), options),
    activate: pageName
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
