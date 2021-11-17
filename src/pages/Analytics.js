import React, { useState } from 'react';
import {analyticsFile} from '../api';

function Analytics() {
  const [file, setFile] = useState(undefined);
  const [isReady, setReadyState] = useState(false);
  const [isUploading, setUploadState] = useState(false);
  const [isOpenAlert, setOpenAlerState] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState('');
  const onChange = event => {
    const currentFile = event.target.files[0];
    setReadyState(!!currentFile)
    setFile(currentFile);
  };
  const onCloseAlert = event => {
    setOpenAlerState(false);
  };
  const showAlert = (type, message) => {
    setMessageAlert(message);
    setTypeAlert(type)
    setOpenAlerState(true);
  };
  const resetForm = () => {
    setUploadState(false);
    setFile(undefined);
  };
  const onSubmit = event => {
    event.preventDefault();
    setUploadState(true);
    analyticsFile(file)
    .then((result) => {
      const message = <>
        <strong>Success:</strong> The file result is <a href={result.data.payload}>here</a>.
      </>;
      showAlert('success', message);
      resetForm();
    })
    .catch((error) => {
      const message = <>
        <strong>An error occurred:</strong> {error.message}.
      </>;
      showAlert('danger', message);
      resetForm();
    });
  };
  return (
    <main>
      <h2>Analytics</h2>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="formFileLg" className="form-label">Selected the file csv, xls or xlsx.</label>
                  <input
                    className="form-control"
                    id="formFileLg"
                    type="file"
                    onChange={onChange}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </div>
                <button type="submit" className="btn btn-primary mb-3" disabled={!isReady || isUploading}>
                  {
                    isUploading ?
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span className="visually-hidden"></span>
                      Loading...
                    </>
                    :
                    'Upload'
                  }
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            <div className="col">
              {
                isOpenAlert &&
                <div className={`alert alert-${typeAlert} alert-dismissible fade show`} role="alert">
                  {messageAlert}
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={onCloseAlert}></button>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Analytics;
