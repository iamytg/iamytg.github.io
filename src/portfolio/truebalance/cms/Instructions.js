import React, {Component} from 'react';
import update from 'react-addons-update';
import axios from 'axios';
import {toast} from 'react-toastify';
import {arrayMove, SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import Files from 'react-files';

import FontAwesome from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/fontawesome-free-regular';

import * as consts from '../Constants';

// if (process.env.NODE_ENV !== 'production') {
//     require('bootstrap/dist/css/bootstrap.css');
// }
import './RechargerNetwork.css';

const pages = [
  {id: 'SERVICE_INTRODUCTION', name: 'Service introduction'},
  {id: 'DETAILS', name: 'See Detail'},
  {id: 'MEMBERSHIP_WELCOME', name: 'Welcome_Bottom'},
  {id: 'MEMBERSHIP_GOLD', name: 'Gold_Bottom'},
  {id: 'BLOCKED', name: 'Page Block'},
  {id: 'PROMO_CODES', name: 'Promotion Page'}
];
const buttons = [
  {goPage: 'recharge.club.detail', name: 'See Detail page'},
  {goPage: 'recharge.club', name: 'Recharge Membership Main page'},
  {goPage: 'promotc', name: 'T&C web page'},
  {goPage: 'play-store', name: 'Google play Store'},
  {goPage: 'recharge.club.follower', name: 'Revite bottom sheet'},
  {goPage: 'recharge', name: 'Recharge Tab'},
  {goPage: 'new-recharge', name: 'New Recharge'},
  {goPage: 'recharge.club.introduction', name: 'Service introduction page'},
  {goPage: 'loan-main', name: 'Easy Pay Plan Main'}
];
const buttonStyles = [
  {id: 'LINK', name: 'Link'},
  {id: 'ORANGE', name: 'Type1'},
  {id: 'OUTLINED', name: 'Type2'}
];
const max = {images: 5, buttons: 3, fileSize: 102400};


const DragHandle = SortableHandle(({item}) =>
    <img className="media-object" src={item.preview ? item.preview.url : item.url}
      alt="" style={{width: '64px', cursor: 'ns-resize'}}/>
);
const SortableItem = SortableElement(({item, idx, ...props}) =>
    <div className="list-group-item" key={idx}>
      <div className="row">
        <div className="col-xs-9 col-md-10 media">
          <div className="media-left">
            <DragHandle item={item}/>
          </div>
          <div className="media-body">
            <h5 className="media-heading">
              <strong style={{fontWeight: 900}}>#{idx + 1}</strong> {item.name}</h5>
            {item.sizeReadable ? `${item.sizeReadable} (Waiting for upload)` : 'Previously uploaded'}
          </div>
        </div>
        <div className="col-xs-3 col-md-2 text-right">
          <button type="button" className="btn btn-danger btn-sm text-center"
            id={`image-${idx}`} onClick={props.removeFile}>
            <FontAwesome icon={faTrashAlt} />
          </button>
        </div>
      </div>
    </div>
);
const SortableList = SortableContainer(({items, ...props}) =>
    <div className="list-group">
        {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} item={value} idx={index} {...props}/>
        ))}
        <Files
          ref={node => {props.parent.files = node;}}
          className={`files-dropzone-list list-group-item active text-center${props.lenImages < 5 ? '' : ' hide'}`}
          style={{lineHeight: '50px', cursor: 'pointer', fontSize: '1.5em'}}
          onChange={props.onFilesChange}
          onError={props.onFilesError}
          accepts={['image/*']}
          multiple
          maxFiles={max.images}
          maxFileSize={max.fileSize}
          minFileSize={0}
          clickable
        >Drop image files here or click to upload</Files>
    </div>
);

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = this.getInitState();
        this.initialize();
    }

    getInitState() {
        return {
          pageId: pages[0].id, images: [],
          status: {loading: true, editable: true, editing: false, modified: false,
            editableButtons: true, saving: false},
          etc: {maxImageCount: max.images, updatedAt: null, updater: null}
        };
    }

    initialize() {
        this.urlPrefix = (window.location.host === 'localhost:3000' ? 'http://localhost:8080' : '');

        this.searchParams = new URLSearchParams(this.props.search);
        this.files = null;
    }

    componentDidMount() {
        this.fetchData(this.state.pageId);
    }

    fetchData(pageId) {
      this.setState(update(this.state, {status: {loading: {$set: true}}}), () => {
        axios.get(`${this.urlPrefix}/recharger-network/read-variables`, {
            params: {targetMonth: window.$targetMonth}
        }).then(response => {
            this.setupData(response.data, pageId);
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                consts.goSignin();
            } else {
                axios.get('/mockups/truebalance/recharger-network-variables.json')
                    .then(response => {
                        this.setupData(response.data, pageId);
                    }).catch(error2 => {
                    toast(consts.NOT_RESPONDING);
                    console.error(error2);
                });
            }
        });
      });
    }

    setupData(data, pageId) {
      this.varId = data[0].id;
      this.targetMonth = data[0].targetMonth;
      this.setupPage(pageId, data[0]);
    }

    onChangePage = ev => {
      if (!this.state.status.modified || window.confirm(`There is some modified content.
Do you want to select another page without saving it?`)) {
        this.fetchData(ev.target.value);
      }
    }

    generateUploadedImage(url) {
      const img = new URL(url);
      return {url: url,
        name: window.decodeURIComponent(img.pathname.substring(img.pathname.lastIndexOf('/') + 1))
      };
    }

    setupPage(pageId, data) {
      const changes = {status: {
        loading: {$set: false}, editing: {$set: false},
        modified: {$set: false}, editableButtons: {$set: true},
      }, pageId: {$set: pageId}, images: {$set: []}, deletedImages: {$set: []},
        etc: {
          maxImageCount: {$set: max.images},
          updatedAt: {$set: consts.getUTCandConvertIndia(data.instructionsUpdatedAt)},
          updater: {$set: data.instructionsUpdater},
        }
      };
      const pages = JSON.parse(data.instructions)

      if (pages) {
        for (const page of pages) {
          if (pageId === page.id) {
            changes.page = {$set: page};
            break;
          }
        }
      }

      if (changes.page) {
        for (const url of changes.page.$set.images) {
          changes.images.$set.push(this.generateUploadedImage(url));
        }
      } else {
        changes.page = {$set: {id: pageId, name: null, images: [], buttons: {relative: [], floating: null}}};
      }

      switch (pageId) {
        case 'PROMO_CODES':
          changes.etc.maxImageCount.$set = 1;
          changes.status.editableButtons.$set = false;
          break;
        default:
      }

      this.setState(update(this.state, changes));
    }


    save(instructions, varId) {
      axios.post(`${this.urlPrefix}/recharger-network/metainfo/instructions`, {
        targetMonth: this.targetMonth, id: varId,
        instructions: JSON.stringify(instructions),
        deletedImages: [] //this.state.deletedImages.map(img => img.url)
      }).then(response => {
        this.setState(update(this.state, {
          status: {saving: {$set: false}, modified: {$set: false}},
          etc: {
            updatedAt: {$set: consts.getUTCandConvertIndia(response.data.instructionsUpdatedAt)},
            updater: {$set: response.data.instructionsUpdater},
          }
        }));
        toast('Saved successfully.');
      }).catch(err => window.alert('Error saving :('));
    }

    syncForSaving(uploadedImages) {
      const images = this.state.images.slice(0);

      if (uploadedImages) {
        let seq = 0;
        for (let idx in images) {
          if (images[idx].preview) {
            images.splice(idx, 1, this.generateUploadedImage(uploadedImages[seq++]));
          }
        }
      }

      this.setState(update(this.state, {
        images: {$set: images},
        page: {images: {$set: images.map(img => img.url)}}
      }), () => {
        axios.get(`${this.urlPrefix}/recharger-network/read-variables`, {
            params: {targetMonth: this.targetMonth}
        }).then(response => {
            const instructions = JSON.parse(response.data[0].instructions) || [];
            if (instructions.length) {
              let isExistedPage = false;
              for (const idx in instructions) {
                if (instructions[idx].id === this.state.page.id) {
                  instructions.splice(idx, 1, this.state.page);
                  isExistedPage = true;
                  break;
                }
              }

              if (!isExistedPage) {
                instructions.push(this.state.page);
              }
            } else {
              instructions.push(this.state.page);
            }

            this.save(instructions, response.data[0].id.toString());
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                consts.goSignin();
            }
        });
      });
    }

    onSubmit = ev => {
      ev.preventDefault();

      if (this.state.status.editing) {
        this.setState(update(this.state, {status: {
          saving: {$set: true}, editing: {$set: false}
        }}), () => {
          const formData = new FormData();
          Object.keys(this.state.images).forEach((key) => {
            const file = this.state.images[key];
            if (file.preview) {
              formData.append('files', new Blob([file], { type: file.type }), file.name || 'file');
            }
          });
          if (formData.getAll('files').length) {
            formData.append('id', this.varId);

            axios.post(`${this.urlPrefix}/recharger-network/metainfo/instructions/files`, formData)
              .then(response => {
                this.syncForSaving(response.data);
              }).catch(err => window.alert('Error uploading files :('))
          } else {
            this.syncForSaving();
          }
        });
      } else {
        this.setState(update(this.state, {status: {editing: {$set: true}}}));
      }
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(update(this.state, {
            images: {$set: arrayMove(this.state.images, oldIndex, newIndex)},
            status: {modified: {$set: true}}
        }));
    }

    onFilesChange = files => {
      if (this.state.images.length + files.length > max.images) {
        files.splice(max.images - this.state.images.length, Number.MAX_SAFE_INTEGER);
        alert(`Up to ${max.images} images can be supported.`);
      }
      if (files.length) {
        this.setState(update(this.state, {
          images: {$push: files}, status: {modified: {$set: true}}
        }), () => {
          this.files.removeFiles();
          // console.log(this.state)
        });
      }
    }
    onFilesError = (error, file) => {
      switch (error.code) {
        case 2:
          alert(error.message);
          break;
        default:
          console.error('error code ' + error.code + ': ' + error.message);
      }
    }
    removeFile = ev => {
      const idx = Number.parseInt(ev.currentTarget.id.substring(6), 10);
      const image = this.state.images[idx];

      if (window.confirm(`This can not be recovered. Do you want to continue?
(Saved images will be restored if you do not save this page.)`)) {
        const images = this.state.images.slice(0);
        images.splice(idx, 1);
        const changes = {images: {$set: images}, status: {modified: {$set: true}}};
        if (!image.preview) {
          changes.deletedImages = {$push: [image]};
        }

        this.setState(update(this.state, changes), () => {
          // console.log(this.state);
        });
      }
    }

    onChangeBtn = ev => {
      const name = ev.target.name.split('-');
      const change = {[name[1]]: {$set: ev.target.value}};
      this.setState(update(this.state, {
        page: {buttons: {
          [name[0]]: (name[0] === 'floating' ? change : {[Number.parseInt(name[2], 10)]: change})
        }},
        status: {modified: {$set: true}}
      }));
    }

    removeButton = ev => {
      const name = ev.target.id.split('-');
      if (name[0] === 'floating') {
        this.setState(update(this.state, {
          page: {buttons: {floating: {$set: null}}}
        }));
      } else {
        console.log(this.state.page.buttons[name[0]]);
        const buttons = this.state.page.buttons[name[0]].slice(0);
        buttons.splice(Number.parseInt(name[1], 10), 1);
        this.setState(update(this.state, {
          page: {buttons: {[name[0]]: {$set: buttons}}},
          status: {modified: {$set: true}}
        }));
      }
    }

    renderButton = (btn, i) => {
      let type = i === undefined ? 'floating' : 'relative';
      if (type === 'floating') {
        i = 0;
      }

      return <li key={i}>
        <div className="card">
          <div className="card-header clearfix">
            <h4 className="card-title pull-left">
              {type === 'floating' ? 'Floating button' : `Normal Button #${i + 1}`}</h4>
            <button type="button" id={`${type}-${i}`} onClick={this.removeButton}
              className={`btn btn-danger btn-sm pull-right${this.state.status.editing ? '' : ' hide'}`}>
              Remove</button>
          </div>
          <div className="card-body">
            <dl className="row">
              <dt className="col-xl-5">Button Label</dt>
              <dd className="col-xl-7"><input type="text" className="form-control" maxLength="100"
                placeholder="Type Text in button" value={btn.label}
                name={`${type}-label-${i}`} onChange={this.onChangeBtn}
                disabled={!this.state.status.editing} required/></dd>
            </dl>
            <dl className="row">
              <dt className="col-xl-5">Button Type (Style)</dt>
              <dd className="col-xl-7">
                <select className="form-control" value={btn.style}
                  name={`${type}-style-${i}`} onChange={this.onChangeBtn}
                  disabled={!this.state.status.editing}>
                  {buttonStyles.map((style, i2) =>
                  <option value={style.id} key={i2}>{style.name} ({style.id})</option>)}
                </select>
              </dd>
            </dl>
            <dl className="row">
              <dt className="col-xl-5">Connected To (goPage)</dt>
              <dd className="col-xl-7">
                <select className="form-control" value={btn.goPage}
                  name={`${type}-goPage-${i}`} onChange={this.onChangeBtn}
                  disabled={!this.state.status.editing}>
                  {buttons.map((btn2, i2) =>
                  <option value={btn2.goPage} key={i2}>{btn2.name}</option>)}
                </select>
              </dd>
            </dl>
          </div>
        </div>
      </li>;
    }

    canAddButtons = () => {
      let count = this.state.page ? this.state.page.buttons.relative.length : max.buttons;
      if (this.state.page && !!this.state.page.buttons.floating) {
        count++;
      }
      return count < max.buttons && this.state.status.editing;
    }

    generateButton() {
      return {label: '', style: buttonStyles[0].id, goPage: buttons[0].goPage};
    }

    addButton = () => {
      this.setState(update(this.state, {
        page: {buttons: {relative: {$push: [this.generateButton()]}}},
        status: {modified: {$set: true}}
      }));
    }

    addFloatingButton = () => {
      this.setState(update(this.state, {
        page: {buttons: {floating: {$set: this.generateButton()}}},
        status: {modified: {$set: true}}
      }));
    }

    render() {
        return (
            <form id="instructions" className="col-lg-12" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-md-10">
                  <select className="form-control" value={this.state.pageId}
                    onChange={this.onChangePage} disabled={this.state.status.saving}>
                    {pages.map((p, i) => <option value={p.id} key={i}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-md-2 text-right">
                  {this.state.status.editable ?
                  <button className="btn btn-primary"
                    disabled={this.state.status.loading || this.state.status.saving}>
                    {this.state.status.loading ? 'Loading...' :
                      (this.state.status.saving ? 'Saving...' :
                        (this.state.status.editing ? 'SAVE' : 'edit')
                      )
                    }
                  </button> : null}
                </div>
              </div>
              <p>{this.state.etc.updatedAt
                ? `Latest updated at ${this.state.etc.updatedAt.format(consts.DATE_FORMAT_EN_IN)}(IST) by ${this.state.etc.updater}`
                : null}</p>
              <div className="row">
                <div className="col-md-6">
                  <div className="card card-info import-images">
                    <div className="card-header">
                      <h3 className="card-title">Import images</h3>
                    </div>
                    <div className="card-body">
                      <div className="card bg-light">
                        <ul className="card-body">
                          <li>Up to {this.state.etc.maxImageCount} image
                            {this.state.etc.maxImageCount === 1 ? '' : 's'} can be supported.</li>
                          <li>The maximum capacity of each file is {max.fileSize / 1024} kB.</li>
                        </ul>
                      </div>
                      {this.state.status.editing ?
                      <SortableList items={this.state.images} lockAxis="y" useDragHandle={true}
                                    useWindowAsScrollContainer={true}
                                    onSortEnd={this.onSortEnd.bind(this)} parent={this}
                                    onFilesChange={this.onFilesChange}
                                    onFilesError={this.onFilesError}
                                    removeFile={this.removeFile}
                                    lenImages={this.state.images.length}/> : null}

                      <div className="card preview">
                        <div className="card-header">
                          <h3 className="card-title">Preview</h3>
                        </div>
                        <ul className="list-unstyled text-center">
                          {this.state.images.map((img, i) =>
                          <li key={i}>
                            <img src={img.preview ? img.preview.url : img.url}
                              alt="" style={{width: '100%', maxWidth: '360px'}}/>
                          </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-info button-set">
                    <div className="card-header">
                      <h3 className="card-title">Button set</h3>
                    </div>
                    <div className="card-body">
                      <div className="card bg-light">
                        <div className="card-body">
                          You can make up to {max.buttons} buttons. (include floating button)<br/>
                          Also, You can have up to 1 floating button.
                        </div>
                      </div>
                      {this.state.status.editableButtons ?
                      <ul className="list-unstyled">
                        {this.state.page ? this.state.page.buttons.relative.map(this.renderButton) : null}
                      </ul> : null}
                      {this.state.status.editableButtons && this.canAddButtons() ?
                      <button type="button" className="btn btn-info btn-block"
                        onClick={this.addButton}>Add button</button> : null}
                      {this.canAddButtons() && !this.state.page.buttons.floating ?
                      <button type="button" className="btn btn-info btn-block"
                        onClick={this.addFloatingButton}>Add floating button</button> : null}
                      <ul className="list-unstyled">
                        {this.state.page && this.state.page.buttons.floating ?
                          this.renderButton(this.state.page.buttons.floating) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </form>
        );
    }
}
