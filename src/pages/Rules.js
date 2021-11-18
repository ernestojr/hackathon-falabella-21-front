import React, { useState, useEffect, useMemo } from 'react';
import { Button, Modal } from 'react-bootstrap';
import cloneDeep from 'lodash/cloneDeep';
import {
  addRule,
  getRules,
  deleteRuleById
} from '../api';

const NEW_RULE = {
  name: '',
  type: '',
  status: 'ACTIVE',
  field: '',
  weight: 0,
  conditions: [],
};

function Rules() {
  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState(cloneDeep(NEW_RULE));
  
  const [modalTitle, setModalTitle] = useState('New rule');
  const [show, setShowModal] = useState(false);
  const [disabledInputs, setDisabledInputState] = useState(false);
  const handleClose = () => setShowModal(false);

  const getData = () => {
    getRules()
    .then((result) => {
      console.log('result', result);
      setRules(result.data.payload);
    })
    .catch((error) => {
      console.log('error', error);
    });
  };

  useEffect(() => {
    getData();
    return () => {
      setRules([]);
    }
  }, [
    setRules,
  ]);
  const onShowRule = (rule) => () => {
    console.log('show rule', rule);
    setRule(rule);
    setDisabledInputState(true);
    setShowModal(true);
    setModalTitle(`Rule ${rule.name}`);
  };
  const onDeleteRule = (rule) => () => {
    console.log('delete rule', rule);
    setRule(rule);
    deleteRuleById(rule._id)
    .then((result) => {
      console.log('result', result);
      getData();
    })
    .catch((error) => {
      console.log('error', error);
      getData();
    });
  };
  const getActions = rule => {
    return <>
      <button type="button" className="btn btn-link" onClick={onShowRule(rule)}>
        <i className="bi bi-eye-fill text-info"></i>
      </button>
      <button type="button" className="btn btn-link" onClick={onDeleteRule(rule)}>
        <i className="bi bi-trash-fill text-info"></i>
      </button>
    </>
  };
  const onCreateNewRule = () => {
    setRule(cloneDeep({...NEW_RULE, now: Date.now()}));
    setModalTitle('New rule');
    setShowModal(true);
    setDisabledInputState(false);
  };
  const addCondition = () => {
    const changes = cloneDeep(rule);
    changes.conditions.push({
      value: '',
      weight: 0,
    });
    setRule(changes);
  };
  const onChangeInput = (field, subField, pos) => (event) => {
    const changes = cloneDeep(rule);
    const value = event.target.value;
    if (field === 'conditions') {
      changes.conditions[pos][subField] = value;
    } else {
      changes[field] = value;
    }
    setRule(changes);
  };  
  const onSubmitModal = (event) => {
    event.preventDefault();
    console.log('rule', JSON.stringify(rule));
    setDisabledInputState(true);
    addRule(rule)
    .then((result) => {
      console.log('result', result);
      setDisabledInputState(false);
      getData();
      setShowModal(false);
    })
    .catch((error) => {
      console.log('error', error);
      setDisabledInputState(false);
      getData();
    });
  };
  const data = useMemo(() => rules, [rules]);
  return (
    <main>
      <div>
        <h2>Rules</h2>
        <button type="button" className="btn btn-info" onClick={onCreateNewRule}>
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th className="text-center" scope="col">Name</th>
            <th className="text-center" scope="col">Type</th>
            <th className="text-center" scope="col">Status</th>
            <th className="text-center" scope="col">Field</th>
            <th className="text-center" scope="col">Weight</th>
            <th className="text-center" scope="col">Conditions</th>
            <th className="text-center" scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            data.length > 0 ? data.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td className="text-center">{item.name}</td>
                <td className="text-center">{item.type}</td>
                <td className="text-center">{item.status}</td>
                <td className="text-center">{item.field}</td>
                <td className="text-center">{item.weight}</td>
                <td className="text-center">{item.conditions.length}</td>
                <td className="text-center">{getActions(item)}</td>
              </tr>
            ))
            :
            <tr>
              <td className="text-center" colSpan={8}>Not data found</td>
            </tr>
          }
        </tbody>
      </table>
      {
        rule &&
        <Modal show={show}>
          <form onSubmit={onSubmitModal}>
            <Modal.Header>
              <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  placeholder="Rule name"
                  onChange={onChangeInput('name')}
                  value={rule.name}
                  disabled={disabledInputs}/>
                <label htmlFor="nameInput">Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="typeInput"
                  placeholder="Rule type"
                  onChange={onChangeInput('type')}
                  value={rule.type}
                  disabled={disabledInputs}/>
                <label htmlFor="typeInput">Type</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="statusInput"
                  aria-label="Status input"
                  onChange={onChangeInput('status')}
                  value={rule.status}
                  disabled={disabledInputs}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
                <label htmlFor="statusInput">Status</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="fieldInput"
                  placeholder="Rule field"
                  onChange={onChangeInput('field')}
                  value={rule.field}
                  disabled={disabledInputs}/>
                <label htmlFor="fieldInput">Field</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="weightInput"
                  placeholder="Rule weight"
                  onChange={onChangeInput('weight')}
                  value={rule.weight}
                  disabled={disabledInputs}/>
                <label htmlFor="weightInput">Weight</label>
              </div>
              <p>Conditions:</p>
              {
                !rule._id &&
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={addCondition}
                  disabled={disabledInputs}>
                  <i className="bi bi-plus-lg"></i>
                </button>
              }
              {
                rule.conditions.length > 0 && rule.conditions.map((item, index) => <div key={`${rule.now}-${index}`}>
                  <hr/>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="valueInput"
                      placeholder="Condition value"
                      onChange={onChangeInput('conditions', 'value', index)}
                      value={item.value}
                      disabled={disabledInputs}/>
                    <label htmlFor="valueInput">Value</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="weightInput"
                      placeholder="Condition weight"
                      onChange={onChangeInput('conditions', 'weight', index)}
                      value={item.weight}
                      disabled={disabledInputs}/>
                    <label htmlFor="weightInput">Weight</label>
                  </div>
                </div>)
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary"
                type="button"
                onClick={handleClose}>
                Close
              </Button>
              {
                !rule._id &&
                <Button
                  variant="primary"
                  type="submit"
                  disabled={disabledInputs}>
                    {
                      disabledInputs ?
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden"></span>
                        Loading...
                      </>
                      :
                      'Save Changes'
                    }
                </Button>
              }
            </Modal.Footer>
          </form>
        </Modal>
      }
    </main>
  );
}

export default Rules;
