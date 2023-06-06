import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
  strings,
  translateString,
  numbers,
  ASSESSOR_ASSESSMENT,
  SELF_ASSESSMENT,
  ADVISOR_ASSESSMENT,
  ASSESSOR,
  ENTITY_ADVISOR,
  MASTER_ASSESSOR,
  MASTER_ASSESSOR_ASSESSMENT,
} from '../../utilities';
import { SkipCampaign, InductionMeetingModal } from '../../components';

function getStatus(val, key, submitted) {
  switch (val) {
    case true:
      return 'done';
    case 100:
      return (key === ASSESSOR_ASSESSMENT && submitted.assessor) ||
        (key === SELF_ASSESSMENT && submitted.self) ||
        (key === ADVISOR_ASSESSMENT && submitted.advisor) ||
        (key === MASTER_ASSESSOR_ASSESSMENT && submitted.maturity)
        ? 'done'
        : 'in-progress';
    case false:
      return 'idle';
    case 0:
      return 'idle';
    default:
      return 'in-progress';
  }
}

/**
 * A component that displays the timeline of the campaign and the progress of every step in it.
 */
class Timeline extends React.Component {
  render() {
    const {
      progress,
      language,
      items,
      role,
      isSkipped,
      inductionDetails,
    } = this.props;
    const { entityId, campaignId } = this.props;

    return (
      <div className="timeline">
        {items.map((item, index) => {
          const current = this.props.current === index ? 'current' : '';
          const done = index < this.props.current ? 'done' : '';
          let inductionMeetingHeld = false;
          if (index === 0) {
            inductionMeetingHeld = item.held;
          }
          if (progress) {
            let status = getStatus(item.value, item.key, item.submitted);
            const shouldSkip =
              item.key === ADVISOR_ASSESSMENT &&
              role === MASTER_ASSESSOR &&
              !item.submitted.advisor &&
              !!item.submitted.assessor &&
              !isSkipped;
            if (isSkipped && item.key === ADVISOR_ASSESSMENT) {
              status = 'done';
            }
            return (
              <div key={index} className={`timeline__item bold ${status}`}>
                {status === 'in-progress' && (
                  <div className="timeline__chart">
                    <Doughnut
                      style={{ width: '100px' }}
                      data={{
                        datasets: [
                          {
                            data: [
                              Number(item.value),
                              100 - Number(item.value),
                            ],
                            backgroundColor: ['#00665E', '#fff'],
                          },
                        ],
                        options: {
                          maintainAspectRatio: false,
                        },
                      }}
                      options={{
                        tooltips: {
                          enabled: false,
                        },
                      }}
                    />
                    <span>
                      {language === 'ar'
                        ? numbers.convertToArabic(String(item.value))
                        : item.value}
                      %
                    </span>
                  </div>
                )}
                {status !== 'in-progress' && (
                  <div className="timeline__circle-wrapper">
                    <div className="timeline__circle">
                      {status === 'idle' && (
                        <span> {language === 'ar' ? '٠' : 0}%</span>
                      )}
                    </div>
                  </div>
                )}
                <span>{item.name}</span>
                {item.key === SELF_ASSESSMENT &&
                  item.submitted &&
                  item.submitted.self === 1 &&
                  role === MASTER_ASSESSOR && (
                    <Link
                      to={
                        role === ASSESSOR
                          ? `/assessment/${item.ids.assessment}/campaign/${
                              item.ids.campaign
                            }/entity/${item.ids.entity}`
                          : `/assessments/${item.ids.assessment}/${
                              item.ids.campaign
                            }/${item.ids.entity}`
                      }
                    >
                      {translateString(strings.campaign.viewAssessment)}
                    </Link>
                  )}
                {item.key === ASSESSOR_ASSESSMENT &&
                  item.submitted &&
                  item.submitted.assessor === 1 &&
                  (role === ASSESSOR || role === MASTER_ASSESSOR) && (
                    <Link
                      to={
                        role === ASSESSOR
                          ? `/assessment/${item.ids.assessment}/campaign/${
                              item.ids.campaign
                            }/entity/${item.ids.entity}`
                          : `/assessments-assessor/${item.ids.assessment}/${
                              item.ids.campaign
                            }/${item.ids.entity}`
                      }
                    >
                      {translateString(strings.campaign.viewAssessment)}
                    </Link>
                  )}
                {shouldSkip && (
                  <SkipCampaign
                    campaignId={item.ids.campaign}
                    entityId={item.ids.entity}
                  />
                )}

                {item.key === ADVISOR_ASSESSMENT &&
                  (role === MASTER_ASSESSOR || role === ENTITY_ADVISOR) &&
                  (item.submitted.advisor === 1 || !!isSkipped) && (
                    <Link
                      to={
                        role === ENTITY_ADVISOR
                          ? `/assessment/${item.ids.assessment}/campaign/${
                              item.ids.campaign
                            }/entity/${item.ids.entity}`
                          : `/ea-assessment/${item.ids.assessment}/${
                              item.ids.campaign
                            }/${item.ids.entity}`
                      }
                    >
                      {translateString(strings.campaign.viewAssessment)}
                      {!!isSkipped && (
                        <span className="skipped">
                          {` (${translateString(
                            strings.skipCampaign.skipped
                          )})`}
                        </span>
                      )}
                    </Link>
                  )}

                {item.key === MASTER_ASSESSOR_ASSESSMENT &&
                  item.submitted &&
                  (isSkipped || item.submitted.advisor === 1) &&
                  role === MASTER_ASSESSOR && (
                    <Link
                      to={`/ma-assessment/${item.ids.assessment}/${
                        item.ids.campaign
                      }/${item.ids.entity}`}
                    >
                      {translateString(strings.campaign.viewAssessment)}
                    </Link>
                  )}
                {!inductionMeetingHeld &&
                  index === 0 &&
                  (role === ASSESSOR || role === MASTER_ASSESSOR) && (
                    <div className="timeline__induction-meeting not-held">
                      <Link
                        to={`/campaigns/${campaignId}/entity/${entityId}/induction-meeting`}
                      >
                        {translateString(strings.timeline.induction)}
                      </Link>
                    </div>
                  )}
                {inductionMeetingHeld &&
                  index === 0 &&
                  (role === ASSESSOR || role === MASTER_ASSESSOR) && (
                    <div className="timeline__induction-meeting">
                      <Link
                        to={`/campaigns/${campaignId}/entity/${entityId}/induction-meeting`}
                      >
                        {translateString(strings.timeline.editInduction)}
                      </Link>
                      <InductionMeetingModal
                        date={inductionDetails.induction_meeting_date}
                        attendees={inductionDetails.induction_meeting_attendees}
                        notes={inductionDetails.induction_meeting_notes}
                        file={inductionDetails.induction_meeting_file}
                      />
                    </div>
                  )}
              </div>
            );
          }
          return (
            <div
              key={index}
              className={`timeline__item bold ${done} ${current}`}
            >
              <div className="timeline__circle" />
              <span>{progress ? item.name : item}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
export default Timeline;

Timeline.propTypes = {
  items: PropTypes.array,
  progress: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  current: PropTypes.number,
  role: PropTypes.number,
  language: PropTypes.string,
  isSkipped: PropTypes.bool,
  entityId: PropTypes.number,
  campaignId: PropTypes.number,
  inductionDetails: PropTypes.object,
};
