import React, {Component} from 'react';
import update from 'react-addons-update';
import axios from 'axios';
import {toast} from 'react-toastify';

import ReactModal from 'react-modal';
import {arrayMove, SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import ordinal from 'ordinal';

import FontAwesome from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular';

import * as consts from '../Constants';


const package_attributes = ['payableAmount', 'obtainableAmount'];

const DragHandle = SortableHandle(({pack, idx}) =>
    <div className="col-sm-2" style={{cursor: 'ns-resize'}}>
      <span className="glyphicon glyphicon-sort"></span> &nbsp;{ordinal(idx + 1)}</div>
);

const SortableItem = SortableElement(({pack, idx, onChangePack, data, ...props}) =>
    <li className="list-group-item">
      <div className="row table-condition">
        <DragHandle pack={pack} idx={idx}/>
        <div className="col-md-4">
            <input type="text" name={`payableAmount_${idx}`} className="form-control" value={pack.payableAmount}
                   onChange={onChangePack} required maxLength="8" placeholder="Payable Amount"/>
        </div>
        <div className="col-md-4">
            <input type="text" name={`obtainableAmount_${idx}`} className="form-control" value={pack.obtainableAmount}
                   onChange={onChangePack} required maxLength="5" placeholder="Obtainable Amount"/>
        </div>
        <div className="col-md-2 text-right">
            <button type="button" className="btn btn-link"
              onClick={props.removePackage} name={idx}>
              <FontAwesome icon={faTrashAlt} />
            </button>
        </div>
      </div>
    </li>
);

const SortableList = SortableContainer(({items, ...props}) =>
    <ul className="list-group">
        {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} pack={value} idx={index} {...props}/>
        ))}
        <li className="list-group-item">
          <div className="row table-condition">
          <button type="button" className="btn btn-block btn-info"
            style={{margin: '0 10px'}}
            onClick={props.addPackage}>Add a package</button>
          </div>
        </li>
    </ul>
);


export default class extends Component {
    constructor(props) {
        super(props);

        this.urlPrefix = (window.location.host === 'localhost:3000' ? 'http://localhost:8080' : '');
        this.state = this.getInitState();
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.isOpen !== nextProps.isOpen) {
        this.setState(update(this.state, {modalPackages: {isOpen: {$set: nextProps.isOpen}}}));
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState.modalPackages.isOpen && !this.state.modalPackages.isOpen) {
        this.props.close();
      }
    }

    getInitState() {
        return {
            modalPackages: {data: [], isOpen: false, isModified: false},
        };
    }

    handleAfterOpenModal() {
      axios.get(`${this.urlPrefix}/gem/packages`)
          .then(response => {
              this.appendPackages(response.data);
          }).catch(error => {
          if (error.response && error.response.status === 400) {
              consts.goSignin();
          } else {
              axios.get('/mockups/truebalance/gem-packages.json')
                  .then(response => {
                      this.appendPackages(response.data);
                  }).catch(error2 => {
                  toast(consts.NOT_RESPONDING);
                  this.setState(update(this.state, {
                    modalPackages: {isOpen: {$set: false}
                  }}));
              });
          }
      });
    }

    appendPackages(data) {
      console.log(data);
      this.setState(update(this.state, {
        modalPackages: {data: {$set: data.packages}, isModified: {$set: false}
      }}));
    }

    handleCloseModal() {
      if (!this.state.modalPackages.isModified
        || window.confirm('Do you want to close without saving?')) {
        this.setState(update(this.state, {
          modalPackages: {isOpen: {$set: false}
        }}));
      }
    }

    onSortEnd({oldIndex, newIndex}) {
        this.setState(update(this.state, {
          modalPackages: {
            data: {$set: arrayMove(this.state.modalPackages.data, oldIndex, newIndex)},
            isModified: {$set: true},
          }
        }), () => {
          this.state.modalPackages.data.forEach((pack, idx) => {
            pack.order = idx + 1;
          });
        });
    }

    onChangePack(ev) {
      let name = ev.target.name;
      const idx = name.lastIndexOf('_');
      const index = name.substring(idx + 1);
      let val = ev.target.value;
      name = name.substring(0, idx);

      const pack = {};

      switch (name) {
          case 'payableAmount':
          case 'obtainableAmount':
              val = Number.parseInt(val.replace(/\D*/g, ''), 10) || 0;
              break;
          default:
      }
      pack[name] = {$set: val};

      this.setState(update(this.state, {
          modalPackages: {data: {[index]: pack}, isModified: {$set: true}
      }}));
    }

    onSubmitPackages(ev) {
      ev.preventDefault();

      const data = this.state.modalPackages.data;

      for (let i = 0; i < data.length; i++) {
        for (let att of package_attributes) {
          if (!data[i][att]) {
            alert('Invalid value');
            document.querySelector(`[name=${att}_${i}]`).focus();
            return;
          }
        }
      }

      if (window.confirm(`Would you really save?`)) {
          axios.post(`${this.urlPrefix}/gem/packages`, data)
              .then(response => {
                  if (response.data.result !== 1000) {
                      toast(response.data.description);
                  } else {
                      this.setState(update(this.state, {
                        modalPackages: {isOpen: {$set: false}
                      }}));
                  }
              }).catch(error => {
              if (error.response && error.response.status === 400) {
                  consts.goSignin();
              } else {
                  console.error(error);
              }
          });
      }
    }

    addPackage() {
      let data = this.state.modalPackages.data[0];
      data = Object.assign({}, data, {payableAmount: 0, obtainableAmount: 0});
      this.setState(update(this.state, {
          modalPackages: {data: {$push: [data]}, isModified: {$set: true}
      }}));
    }

    removePackage(ev) {
      let idx = Number.parseInt(ev.currentTarget.name, 10);
      this.setState(update(this.state, {
          modalPackages: {data: {$splice: [[idx, 1]]}, isModified: {$set: true}
      }}));
    }

    render() {
      return (
        <ReactModal isOpen={this.state.modalPackages.isOpen}
          onAfterOpen={this.handleAfterOpenModal.bind(this)}
          onRequestClose={this.handleCloseModal.bind(this)}
          parentSelector={() => {
            return document.getElementById('page-wrapper') || document.getElementById('luckygame-list')
          }}
          style={{overlay: {position: 'absolute'}}} className="modal-dialog">
          <form className="modal-content" onSubmit={this.onSubmitPackages.bind(this)}>
            <div className="modal-header">
              <h2>Update Redeem Point Packages</h2>
              <button type="button" className="close" onClick={this.handleCloseModal.bind(this)}>×</button>
            </div>
            <div className="modal-body">
              <div className="row text-center padding" style={{marginTop: 15}}>
                <div className="col-md-4 offset-md-2">Payable Amount</div>
                <div className="col-md-4">Obtainable Amount</div>
              </div>
              <SortableList items={this.state.modalPackages.data} lockAxis="y" useDragHandle={true}
                    useWindowAsScrollContainer={true} helperClass="helper"
                    onSortEnd={this.onSortEnd.bind(this)}
                    onChangePack={this.onChangePack.bind(this)} data={this.state}
                    addPackage={this.addPackage.bind(this)}
                    removePackage={this.removePackage.bind(this)}/>
            </div>
            <div className="modal-footer">
              <div className="row">
                <div className="col">
                  <button type="button" className="btn btn-outline btn-primary btn-sm btn-block"
                    onClick={this.handleCloseModal.bind(this)}>Cancel</button>
                </div>
                <div className="col">
                  <button className="btn btn-outline btn-primary btn-sm btn-block"
                    disabled={!this.state.modalPackages.isModified}>Save</button>
                </div>
              </div>
            </div>
          </form>
        </ReactModal>
      );
    }

}
