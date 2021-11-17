import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import {getRules} from '../api';

function Rules() {
  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState(undefined);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useEffect(() => {
    getRules()
    .then((data) => {
      console.log('data', data);
      setRules(data);
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
    setShow(true);
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
  return (
    <main>
      <h2>Rules</h2>
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
            rules.length > 0 && rules.map(rule => (
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
          }
        </tbody>
      </table>
      {
        rule &&
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Rule {rule.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </main>
  );
}

export default Rules;
