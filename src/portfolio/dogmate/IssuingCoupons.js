import "./main.css";

import React, { Component } from "react";
import PropTypes from "prop-types";
import update from "react-addons-update";
import axios from "axios";

// import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

import { Snackbar, Paper, RaisedButton, TextField } from "material-ui";
import { List, ListItem, makeSelectable } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import { grey400 } from "material-ui/styles/colors";
import IconButton from "material-ui/IconButton";
import ActionDelete from "material-ui/svg-icons/action/delete";
// import 'react-data-grid/dist/react-data-grid.css';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      // this.setState({
      //   selectedIndex: index,
      // });
      this.props.click2(index);
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

const RightIconMenu = ({ onDelete }) => (
  <div
    style={{
      display: "block",
      position: "absolute",
      marginTop: 12,
      top: 0,
      right: 4,
    }}
  >
    <IconButton
      touch={true}
      onClick={onDelete}
      tooltip="대상에서 제외"
      tooltipPosition="bottom-left"
    >
      <ActionDelete color={grey400} />
    </IconButton>
  </div>
);

export default class IssuingCoupons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbar: { open: false, message: "" },
      canSave: false,
      coupons: [],
      selectedCoupon: {},
      targets: [],
      customers: [],
      searchInput: "",
    };
  }

  componentDidMount() {
    this.refresh(true);
  }

  refresh_proc(isInitial, data) {
    if (isInitial) {
    } else {
    }
    this.setState({ coupons: data });
    console.debug(data);
  }

  refresh(isInitial) {
    axios
      .get("/manage/coupons/issuing/coupons")
      .then((response) => {
        // console.log(response);
        this.refresh_proc(
          isInitial,
          response.data.filter((item) => !!item.coupon_code)
        );
      })
      .catch((response) => {
        axios
          .get("/mockups/dogmate/available-coupons.json")
          .then((response2) => {
            this.refresh_proc(
              isInitial,
              response2.data.filter((item) => !!item.coupon_code)
            );
          });
      });
  }

  show_snackbar(msg) {
    this.setState(
      update(this.state, {
        snackbar: {
          open: { $set: true },
          message: { $set: msg },
        },
      })
    );
  }

  render() {
    return (
      <MuiThemeProvider>
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <div className="row">
              <div className="col-sm-6">
                <h4
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  발급할 쿠폰:{" "}
                  {this.state.selectedCoupon.coupon_name || "<미선택>"}
                </h4>
                <Paper>
                  <SelectableList
                    click2={(index) => {
                      this.setState({
                        selectedCoupon: this.state.coupons[index],
                      });
                    }}
                  >
                    <Subheader>가용 쿠폰 목록</Subheader>
                    {this.state.coupons.map((value, index) => (
                      <ListItem
                        key={`item-${index}`}
                        value={index}
                        primaryText={value.coupon_name}
                      />
                    ))}
                  </SelectableList>
                </Paper>
              </div>
              <div className="col-sm-6">
                <RaisedButton
                  label="발급"
                  primary={true}
                  onClick={() => {
                    axios
                      .post("/manage/coupons/issuing/run", {
                        coupon: this.state.selectedCoupon,
                        targets: this.state.targets,
                      })
                      .then((response) => {
                        console.log(response);
                        for (let i in this.state.targets) {
                          for (let j in response.data) {
                            if (
                              this.state.targets[i].MEM_NO ===
                              response.data[j].MEM_NO
                            ) {
                              const targets = [...this.state.targets];
                              targets[i] = response.data[j];

                              this.setState({ ...this.state, targets });
                              break;
                            }
                          }
                        }
                        this.setState({
                          selectedCoupon: {},
                          targets: this.state.targets,
                        });
                        this.show_snackbar("쿠폰 발급 처리가 완료됐습니다.");
                      })
                      .catch((response) => {
                        alert("저장할 수 없습니다.");
                      });
                  }}
                  disabled={
                    !(
                      this.state.selectedCoupon.coupon_no &&
                      this.state.targets.length
                    )
                  }
                />
                <Paper>
                  <List>
                    <Subheader>
                      발급 대상 회원: 총 {this.state.targets.length}명
                    </Subheader>
                    {this.state.targets.map((value, index) => (
                      <ListItem
                        key={`item-${index}`}
                        value={index}
                        primaryText={value.MEM_NM + " " + value.result}
                        secondaryText={value.MEM_EMAIL + ", " + value.ADDR}
                        rightIconButton={
                          <RightIconMenu
                            onDelete={() => {
                              if (
                                window.confirm("정말 대상에서 제외하실 거예요?")
                              ) {
                                this.state.targets.splice(index, 1);
                                this.setState({ targets: this.state.targets });
                              }
                            }}
                          />
                        }
                      />
                    ))}
                  </List>
                </Paper>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (this.state.searchInput.length > 1) {
                  axios
                    .post("/manage/coupons/issuing/members", {
                      name: this.state.searchInput,
                    })
                    .then((response) => {
                      if (response.data.length) {
                        this.setState({ customers: response.data });
                      } else {
                        this.show_snackbar("검색 결과가 없습니다.");
                      }
                    })
                    .catch((response) => {
                      axios
                        .get("/mockups/dogmate/customers.json")
                        .then((response2) => {
                          this.setState({ customers: response2.data.LIST });
                        });
                    });
                } else {
                  this.show_snackbar("2글자 이상의 검색어를 입력하세요.");
                }
              }}
            >
              <TextField
                hintText="회원 이름 검색"
                onChange={(e) => {
                  this.setState({ searchInput: e.target.value.trim() });
                }}
              />
              <Paper>
                <SelectableList
                  click2={(index) => {
                    let canAdd = true;

                    for (let idx in this.state.targets) {
                      if (
                        this.state.targets[idx].MEM_NO ===
                        this.state.customers[index].MEM_NO
                      ) {
                        canAdd = false;
                      }
                    }

                    if (canAdd) {
                      let customer = this.state.customers[index];
                      customer.result = "";
                      this.state.targets.unshift(customer);
                      this.setState({ targets: this.state.targets });
                    } else {
                      this.show_snackbar("이미 발급대상에 포함돼있습니다.");
                    }
                  }}
                >
                  <Subheader>의뢰 고객 (돌보미 제외)</Subheader>
                  {this.state.customers.map((value, index) => (
                    <ListItem
                      key={`item-${index}`}
                      value={index}
                      primaryText={value.MEM_NM}
                      secondaryText={value.MEM_EMAIL + ", " + value.ADDR}
                    />
                  ))}
                </SelectableList>
              </Paper>
            </form>
          </div>

          <Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={5000}
            className="snackbar"
            onRequestClose={() => {
              this.setState(
                update(this.state, {
                  snackbar: {
                    open: { $set: false },
                  },
                })
              );
            }}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
