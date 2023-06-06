import 'core-js/fn/string/includes';
import 'core-js/fn/array/includes';
import { DEEP_DIVE } from '../pages/Campaign/AssessmentTypes';
import {
  strings,
  translateString,
  MASTER_ASSESSOR_ASSESSMENT,
  MASTER_ASSESSOR,
  ENTITY_COORDINATOR,
  ENTITY_USER,
  ASSESSOR,
  ENTITY_ADVISOR,
  ADMIN,
  SELF_ASSESSMENT,
} from './';

export default class AssessmentHelper {
  static updateEvidence(evidence, response) {
    /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["evidence"] }] */
    evidence.entry_files = response.files;
  }
  static getAssessmentPayLoad(values, assessmentType, campaignId, entityId) {
    if (assessmentType === SELF_ASSESSMENT) {
      return {
        campaign_id: 1,
        entity_id: 1,
        ratings: values,
      };
    }
    // let maValues = Object.assign({}, values);
    // if (assessmentType === MASTER_ASSESSOR_ASSESSMENT) {
    //   Object.keys(values).forEach(val => {
    //     if (values[val].maturity || values[val].maturity === "") {
    //       maValues = Object.assign({}, maValues, {
    //         [val]:
    //           values[val].maturity === ""
    //             ? values[val].assessor
    //             : values[val].maturity
    //       });
    //     }
    //   });
    // }
    const ratingsValues = Object.keys(values)
      .filter(key => Number(key) > 0)
      .reduce((newObject, item) => {
        let newItemToAdd = {};
        if (assessmentType === MASTER_ASSESSOR_ASSESSMENT) {
          newItemToAdd = {
            [item]:
              values[item].maturity === ''
                ? values[item].assessor
                : values[item].maturity,
          };
        } else {
          newItemToAdd = { [item]: values[item] };
        }

        return Object.assign({}, newObject, newItemToAdd);
      }, {});

    return {
      campaign_id: campaignId,
      entity_id: entityId,
      ratings: ratingsValues,
      analysis_comments: values.analysis_comment,
      improvement_plans: values.improvement_plans,
      section_analysis_comments: values.section_analysis_comments,
    };
  }
  static validateAssessment(values, pillars) {
    const emptyQuestions = this.checkIfAllQuestionsAnswered(values);
    if (emptyQuestions.length) {
      const inCompletedPillars = [];
      const inCompletedSections = [];
      let shouldBeActivePillar;
      let shouldBeActiveSection;
      const questionId = emptyQuestions[0];
      pillars.forEach((pillar, pillarIdx) => {
        pillar.sections.forEach((section, sectionIdx) => {
          section.questions.forEach(question => {
            if (question.id === questionId) {
              shouldBeActivePillar = pillarIdx;
              shouldBeActiveSection = sectionIdx;
            }
            if (emptyQuestions.includes(question.id)) {
              if (!inCompletedPillars.includes(pillar.id))
                inCompletedPillars.push(pillar.id);
              if (!inCompletedSections.includes(section.id))
                inCompletedSections.push(section.id);
            }
          });
        });
      });
      return {
        shouldBeActivePillar,
        shouldBeActiveSection,
        inCompletedPillars,
        inCompletedSections,
        emptyQuestions,
      };
    }
    return false;
  }
  static checkIfAllQuestionsAnswered(values) {
    const emptyQuestions = [];
    Object.keys(values).forEach(key => {
      if (values[key] === -1) {
        emptyQuestions.push(parseInt(key, 10));
      }
    });
    return emptyQuestions;
  }
  static shouldBeDisabled(role, readonly) {
    switch (role) {
      case ADMIN:
        return true; // Admin
      case MASTER_ASSESSOR:
        //  return false;
        return readonly.maturity; // MA
      case ASSESSOR:
        return readonly.assessor; // Assessor
      case ENTITY_ADVISOR:
        return readonly.advisor; // Advisor
      case ENTITY_COORDINATOR:
        return readonly.self; // EC
      case ENTITY_USER:
        return readonly.self; // EU
      default:
        return readonly.self;
    }
  }
  static getConfirmationMessage(type, role) {
    switch (role) {
      case MASTER_ASSESSOR:
        return translateString(strings.assessment.submitMessageNoEvidence);
      case ASSESSOR:
        return type === DEEP_DIVE
          ? translateString(strings.assessment.asSubmitDeepDive)
          : translateString(strings.assessment.submitMessageNoEvidence);
      case ENTITY_ADVISOR:
        return translateString(strings.assessment.eaSubmitDeepDive);
      case ENTITY_COORDINATOR:
        return type === DEEP_DIVE
          ? translateString(strings.assessment.ecSubmitDeepDive)
          : translateString(strings.assessment.ecSubmitSelfAssessment);

      case ENTITY_USER:
        return type === DEEP_DIVE
          ? translateString(strings.assessment.euSubmitDeepDive)
          : translateString(strings.assessment.euSubmitSelfAssessment);

      default:
        return type === DEEP_DIVE
          ? translateString(strings.assessment.submitMessageEvidence)
          : translateString(strings.assessment.submitMessageNoEvidence);
    }
  }
}
