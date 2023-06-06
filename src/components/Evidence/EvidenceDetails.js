import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import { toastr } from "react-redux-toastr";
import { connect } from "react-redux";
import { createEvidence, deleteFile } from "../../actions";
import {
  strings,
  translateString,
  Confirmation,
  ENTITY_COORDINATOR,
  ENTITY_USER
} from "../../utilities";

export class EvidenceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      isSubmitting: false,
      newFiles: [],
      uplaoding: false
    };
  }
  removeFile(id) {
    this.props
      .deleteFile(id)
      .then(res => {
        toastr.success(res.value.message);
        this.props.updateEvidence(res.value.data);
        this.forceUpdate();
      })
      .catch(err => {
        toastr.error(err.value.message);
      });
  }
  addFiles() {
    const data = new FormData();
    this.state.files.forEach((file, index) => {
      data.append(`uploaded_files[${index}]`, file);
    });
    this.setState({ isSubmitting: true });
    this.props
      .createEvidence(data, this.props.evidence.id)
      .then(res => {
        toastr.success(translateString(strings.message.evidence));
        this.props.updateEvidence(res.value.data.response);
        this.forceUpdate();
        this.setState({
          files: [],
          uploading: false
        });
      })
      .catch(() => {
        this.setState({
          isSubmitting: false
        });
        if (typeof this.props.evidenceCreated === "string")
          toastr.error(this.props.evidenceCreated);
        else toastr.error("Please Check Your Internet Connection");
      });
    this.setState({ files: [] });
  }

  onDrop(files) {
    this.setState(
      {
        files: [...files, ...this.state.files],
        uploading: true
      },
      this.addFiles
    );
  }

  removeFileByIndex(index) {
    const array = [...this.state.files];
    array.splice(index, 1);
    this.setState({
      files: array
    });
  }
  render() {
    const {
      evidence: { translations, entry_files: files },
      userRole: role,
      language
    } = this.props;
    const uploadEvidence =
      (role === ENTITY_COORDINATOR || role === ENTITY_USER) &&
      !this.props.isDisabled;
    return (
      <div className="evidence-wrapper">
        <div className="evidence">
          <p className="evidence__title">
            {translations.length > 0 &&
              translations.find(item => {
                return item.locale === language;
              }).name}
          </p>
          <p className="evidence__label">
            {translateString(strings.evidence.description)}
          </p>
          <p className="evidence__description">
            {translations.length > 0 &&
              translations.find(item => {
                return item.locale === language;
              }).description}
          </p>
          {(files.length > 0 || uploadEvidence) && ( // can add files later on
            <p className="evidence__label">
              {" "}
              {translateString(strings.evidence.files)}
            </p>
          )}
          <ul className="list evidence__files">
            {files &&
              files.map((file, index) => {
                return (
                  <li className="evidence__file" key={index}>
                    <a
                      className="attachment"
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translateString(strings.evidence.file)} {index + 1}
                    </a>
                    {uploadEvidence && (
                      <button
                        onClick={() =>
                          Confirmation.confirmAction(
                            {
                              title: translateString(
                                strings.evidence.confirmDeleteTitle
                              ),
                              message: translateString(
                                strings.evidence.confirmDeleteMessage
                              )
                            },
                            this.removeFile.bind(this),
                            file.id
                          )
                        }
                        className="button"
                        type="button"
                      >
                        &times;
                      </button>
                    )}
                  </li>
                );
              })}
          </ul>
          {uploadEvidence && (
            <Dropzone
              id="file"
              className={this.state.uploading ? "uploading" : "not-uploading"}
              label="files"
              onDrop={this.onDrop.bind(this)}
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { evidenceCreated } = state;

  return {
    evidenceCreated,
    language: state.language,
    ...state.flags
  };
}
const mapDispatchToProps = {
  createEvidence,
  deleteFile
};

export default connect(mapStateToProps, mapDispatchToProps)(EvidenceDetails);

EvidenceDetails.propTypes = {
  evidence: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    comment: PropTypes.string,
    creator: PropTypes.any,
    entry_files: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    created_at: PropTypes.string,
    id: PropTypes.any,
    files: PropTypes.array
  }),
  userRole: PropTypes.number,
  evidenceCreated: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  createEvidence: PropTypes.func,
  deleteFile: PropTypes.func,
  updateEvidence: PropTypes.func,
  language: PropTypes.string,
  isDisabled: PropTypes.bool
};
