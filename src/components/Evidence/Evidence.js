import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { createEvidence } from '../../actions';
import { strings, translateString } from '../../utilities';
/** Custom component for evidence */
export class Evidence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      comment: '',
      files: [],
      isSubmitting: false,
    };
  }

  uploadEvidence() {
    if (
      this.state.name === '' ||
      this.state.description === '' ||
      this.state.files.length === 0
    ) {
      toastr.error(translateString(strings.message.fillEvidence));
      return;
    }
    const data = new FormData();
    this.state.files.forEach((file, index) => {
      data.append(`uploadedFiles[${index}]`, file);
    });
    const { updateEvidences, pillarIndex } = this.props;
    data.append('name', this.state.name);
    data.append('description', this.state.description);
    data.append('comment', this.state.comment || 'No comment submitted');
    data.append('pillar_id', this.props.pillarId);
    this.setState({ isSubmitting: true });
    this.props
      .createEvidence(data)
      .then(res => {
        toastr.success(translateString(strings.message.evidence));
        res.value.data.response.pillar = pillarIndex;
        updateEvidences(res.value.data.response);
        this.setState({
          name: '',
          description: '',
          comment: '',
          files: [],
          isSubmitting: false,
        });
      })
      .catch(() => {
        this.setState({
          isSubmitting: false,
        });
        if (typeof this.props.evidenceCreated === 'string')
          toastr.error(this.props.evidenceCreated);
        else toastr.error('Please Check Your Internet Connection');
      });
  }

  onDrop(files) {
    this.setState({
      files: [...files, ...this.state.files],
    });
  }

  removeFileByIndex(index) {
    const array = [...this.state.files];
    array.splice(index, 1);
    this.setState({
      files: array,
    });
  }

  render() {
    return (
      <div className="evidence-wrapper">
        <div className="form-item">
          <label className="visually-hidden" htmlFor="evidenceName">
            Evidence Name
          </label>
          <input
            type="text"
            id="evidenceName"
            name="name"
            placeholder={translateString(strings.evidence.name)}
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </div>
        <div className="form-item">
          <label className="visually-hidden" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder={translateString(strings.evidence.description)}
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
          />
        </div>
        <div className="form-item">
          <p className="attachment-label">
            {translateString(strings.evidence.files)}
          </p>
          <Dropzone id="file" label="files" onDrop={this.onDrop.bind(this)} />
          <ul className="list evidence-attach">
            {this.state.files.map((f, i) => (
              <li className="file-item" key={i}>
                <span>{f.name}</span>
                <button
                  onClick={() => this.removeFileByIndex(i)}
                  className="button button--plain"
                  type="button"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-item">
          <label className="visually-hidden" htmlFor="comment">
            {translateString(strings.evidence.description)}
          </label>
          <textarea
            name="comment"
            form="comment"
            placeholder={translateString(strings.evidence.description)}
            value={this.state.comment}
            onChange={e => this.setState({ comment: e.target.value })}
          />
        </div>
        <div className="form-action">
          <button
            type="button"
            className="button button--primary"
            disabled={this.state.isSubmitting}
            onClick={() => {
              this.uploadEvidence();
            }}
          >
            {translateString(strings.evidence.save)}
          </button>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { evidenceCreated } = state;

  return {
    evidenceCreated,
  };
}
const mapDispatchToProps = {
  createEvidence,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Evidence);

Evidence.propTypes = {
  /** Id of evidence pillar */
  pillarId: PropTypes.number,
  /** Index of evidence pillar */
  pillarIndex: PropTypes.number,
  /** Upload evidence */
  createEvidence: PropTypes.func,
  /** @ignore */
  evidenceCreated: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]) /** @ignore */,
  updateEvidences: PropTypes.func,
};
