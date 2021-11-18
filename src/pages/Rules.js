import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import cloneDeep from 'lodash/cloneDeep';
import {getRules} from '../api';

const NEW_RULE = {
  name: '',
  type: '',
  status: '',
  field: '',
  weight: 0,
  conditions: [],
};

function Rules() {
  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState(cloneDeep(NEW_RULE));
  
  const [modalTitle, setModalTitle] = useState('New rule');
  const [show, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    getRules()
    .then((result) => {
      setRules(result);
    })
    .catch((error) => {
      console.log('error', error);
    });
    return () => {
      setRules([]);
    }
  }, [
    setRules,
  ]);
  const onShowRule = (rule) => () => {
    console.log('show rule', rule);
    setRule(rule);
    setShowModal(true);
    setModalTitle(`Rule ${rule.name}`);
  };
  const onDeleteRule = (rule) => () => {
    console.log('delete rule', rule);
    setRule(rule);
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
    setRule(cloneDeep(NEW_RULE));
    setModalTitle('New rule');
    setShowModal(true);
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
    console.log('rule', rule);
  };
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
            <th className="text-center" scope="col">ID</th>
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
            rules.length > 0 ? rules.map(rule => (
              <tr key={rule.id}>
                <td className="text-center">{rule.id}</td>
                <td className="text-center">{rule.name}</td>
                <td className="text-center">{rule.type}</td>
                <td className="text-center">{rule.status}</td>
                <td className="text-center">{rule.field}</td>
                <td className="text-center">{rule.weight}</td>
                <td className="text-center">{rule.conditions.length}</td>
                <td className="text-center">{getActions(rule)}</td>
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
        <Modal show={show} onHide={handleClose}>
          <form onSubmit={onSubmitModal}>
            <Modal.Header closeButton>
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
                  value={rule.name}/>
                <label htmlFor="nameInput">Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="typeInput"
                  placeholder="Rule type"
                  onChange={onChangeInput('type')}
                  value={rule.type}/>
                <label htmlFor="typeInput">Type</label>
              </div>
              <div className="form-floating mb-3">
                <select
                  className="form-select"
                  id="statusInput"
                  aria-label="Status input"
                  onChange={onChangeInput('status')}
                  value={rule.status}>
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
                  value={rule.field}/>
                <label htmlFor="fieldInput">Field</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="number"
                  className="form-control"
                  id="weightInput"
                  placeholder="Rule weight"
                  onChange={onChangeInput('weight')}
                  value={rule.weight}/>
                <label htmlFor="weightInput">Weight</label>
              </div>
              <p>Conditions:</p>
              <button
                type="button"
                className="btn btn-info"
                onClick={addCondition}>
                <i className="bi bi-plus-lg"></i>
              </button>
              {
                rule.conditions.length > 0 && rule.conditions.map((item, index) => <div key={`${Date.now()}-${index}`}>
                  <hr/>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="valueInput"
                      placeholder="Condition value"
                      onChange={onChangeInput('conditions', 'value', index)}
                      value={item.value}/>
                    <label htmlFor="valueInput">Value</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="number"
                      className="form-control"
                      id="weightInput"
                      placeholder="Condition weight"
                      onChange={onChangeInput('conditions', 'weight', index)}
                      value={item.weight}/>
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
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      }
    </main>
  );
}

export default Rules;
