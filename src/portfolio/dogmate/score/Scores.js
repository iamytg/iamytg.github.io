import "../main.css";

import React from "react";
import update from "react-addons-update";
import axios from "axios";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { Snackbar, RadioButtonGroup, RadioButton } from "material-ui";
import { Popover, PopoverAnimationVertical } from "material-ui/Popover";
import Formsy from "formsy-react";
import { FormsyText } from "formsy-material-ui/lib";

let mock = {
  entries: [
    {
      entry_no: "1",
      entry_title: "\uace0\uac1d\ub9ac\ubdf0\uc791\uc131\ub960",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.020",
      entry_calc_legend:
        "\ub9ac\ubdf0\uc791\uc131\ud55c \uace0\uac1d\uc218 / \uac70\ub798 \uace0\uac1d\uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 16:48:38",
      updated: "2016-11-30 17:29:25",
      updater: "ian",
    },
    {
      entry_no: "2",
      entry_title: "\uc2a4\ucf00\uc974\uad00\ub9ac",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.010",
      entry_calc_legend:
        "\ucd5c\uadfc 3\uac1c\uc6d4(n-1, n, n+1)\uc758 \ub3cc\ubd04\uac00\ub2a5 \uc2a4\ucf00\uc974 \uc6d4\ud3c9\uade0\n\n18\uc77c \uc774\ud558 : 30\n19\uc77c : 40\n20\uc77c : 50\n21\uc77c : 60\n22\uc77c : 70\n23\uc77c : 80\n24\uc77c : 90\n25\uc77c \uc774\uc0c1 : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:15:52",
      updated: "2016-11-30 17:29:25",
      updater: "ian",
    },
    {
      entry_no: "3",
      entry_title: "\uc7ac\uad6c\ub9e4\uc728",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.010",
      entry_calc_legend:
        "\uc7ac\uad6c\ub9e4\uac74\uc218 / \uc804\uccb4 \uac70\ub798\uac74\uc218\n\n20% \ubbf8\ub9cc : 30\n20%~39% : 50\n40%~59% : 70\n60%~79% : 90\n80%~100% : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:21:31",
      updated: "2016-11-30 17:29:25",
      updater: "ian",
    },
    {
      entry_no: "4",
      entry_title: "\uc0ac\uc804\ub9cc\ub0a8 \uc9c4\ud589",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.020",
      entry_calc_legend:
        "\uc0ac\uc804\ub9cc\ub0a8 \uc9c4\ud589\uac74\uc218 / \uac70\ub798 \uace0\uac1d\uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:21:31",
      updated: "2016-11-30 17:29:25",
      updater: "ian",
    },
    {
      entry_no: "5",
      entry_title: "\uad50\uc721\ucc38\uc5ec\uc728",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.020",
      entry_calc_legend:
        "\ucc38\uc5ec\ud69f\uc218 / \uc804\uccb4 \uad50\uc721 \uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:21:31",
      updated: "2016-11-30 17:29:25",
      updater: "ian",
    },
    {
      entry_no: "6",
      entry_title: "\ub3cc\ubd04\uc77c\uc9c0 \uc791\uc131",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.010",
      entry_calc_legend:
        "\ub3cc\ubd04\uc77c\uc9c0 \ub4f1\ub85d\ud69f\uc218 / \uc804\uccb4 \uac70\ub798\uac74\uc218\n\n89% \uc774\ud558 : 30\n90% \ub300 : 50\n100% : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:29:25",
      updated: null,
      updater: "ian",
    },
    {
      entry_no: "7",
      entry_title: "\uac1c\uc778\ub9c8\ucf00\ud305 \ud65c\ub3d9\uc5ec\ubd80",
      entry_input_min: "30",
      entry_input_max: "100",
      entry_weight: "0.010",
      entry_calc_legend: "No : 30\nYes : 100",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:29:25",
      updated: "2016-11-30 18:08:56",
      updater: "ian",
    },
    {
      entry_no: "8",
      entry_title: "\ub3cc\ubd04 \uc911\ub3c4\ud3ec\uae30\uc728",
      entry_input_min: "0",
      entry_input_max: "100",
      entry_weight: "-0.030",
      entry_calc_legend:
        "\ud3ec\uae30\uac74\uc218 / \uac70\ub798\uac74\uc218\n\n\ud3ec\uae30\uc728 \uc808\ub300\uac12(100%\uc778 \uacbd\uc6b0, 100)",
      entry_automated: "N",
      entry_order: "9999",
      created: "2016-11-30 17:29:25",
      updated: "2016-11-30 17:59:17",
      updater: "ian",
    },
  ],
  scores: [
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: "\uc77c\ubc18",
      score_no: "1",
      s_mem_email: "bbananar@gmail.com",
      entry_no: null,
      level_no: "2",
      final_score: null,
      revisionary_score: null,
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "2",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "1",
      level_no: null,
      final_score: "99.000",
      revisionary_score: "99",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "3",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "2",
      level_no: null,
      final_score: "98.000",
      revisionary_score: "98",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "4",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "3",
      level_no: null,
      final_score: "97.000",
      revisionary_score: "97",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "5",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "4",
      level_no: null,
      final_score: "96.000",
      revisionary_score: "96",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "6",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "5",
      level_no: null,
      final_score: "95.000",
      revisionary_score: "95",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "7",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "6",
      level_no: null,
      final_score: "94.000",
      revisionary_score: "94",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "8",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "7",
      level_no: null,
      final_score: "93.000",
      revisionary_score: "93",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
    {
      email: "bbananar@gmail.com",
      mem_nm: "\uc815\ub098\ub798",
      mem_no: "15121713352115274582",
      level_title: null,
      score_no: "9",
      s_mem_email: "bbananar@gmail.com",
      entry_no: "8",
      level_no: null,
      final_score: "0.000",
      revisionary_score: "0",
      reviser: "ian",
      revision_updated: "2016-12-08 14:00:36",
      updated: "2016-12-08 14:00:36",
    },
  ],
  levels: [
    {
      level_no: "1",
      level_title: "\uc6b0\uc218",
      level_order: "1",
      created: "2016-12-07 10:29:43",
    },
    {
      level_no: "2",
      level_title: "\uc77c\ubc18",
      level_order: "2",
      created: "2016-12-07 10:29:54",
    },
    {
      level_no: "3",
      level_title: "\uc2e0\uaddc",
      level_order: "3",
      created: "2016-12-07 10:30:08",
    },
  ],
};

export default class Scores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      entries: [],
      level: { list: [], input: null },
      total: 0,
      snackbar: { open: false, message: "" },
      canSave: false,
      popover: { open: false, body: "" },
    };

    Formsy.addValidationRule("between", function (values, value, array) {
      let num = parseInt(value, 10);
      return array[0] <= num && num <= array[1];
    });
  }

  componentDidMount() {
    axios
      .get(window.location.pathname + "/scores")
      .then((response) => {
        // console.log(response.data);
        this.refresh_proc(response.data, true);
      })
      .catch((response) => {
        this.refresh_proc(mock, true);
      });
  }

  refresh_proc(data, isInitial) {
    let level = { list: { $set: data.levels } };
    for (let i in data.scores) {
      let score = data.scores[i];
      if (score.level_no) {
        level.input = { $set: score.level_no };
        break;
      }
    }

    for (let idx in data.entries) {
      let entry = data.entries[idx];

      for (let i in data.scores) {
        let score = data.scores[i];

        if (entry.entry_no === score.entry_no) {
          entry.score_no = score.score_no;
          entry.input = score.revisionary_score;
          entry.final_score = entry.final_score
            ? entry.final_score
            : this.calc_score(entry.input, entry.entry_weight);
          break;
        }
      }
    }
    this.setState(
      update(this.state, {
        entries: { $set: data.entries },
        list: { $set: data.scores },
        level: level,
        canSave: { $set: false },
      })
    );

    setTimeout(() => {
      // console.log(this.state.level);
    }, 100);
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

  submit(e) {
    let param = {
      level: this.state.level.changed ? this.state.level.input : null,
    };
    let list = this.state.entries.filter((entry, i) => {
      return !!entry.changed;
    });
    if (this.state.level.changed || list.length) {
      param.scores = list;
      axios
        .post(window.location.pathname + "/save-scores", param)
        .then((response) => {
          // console.info(response);
          // this.refresh_proc(response.data);
          this.show_snackbar("잘 저장했어요~");
        })
        .catch((response) => {
          console.error(response);
          this.show_snackbar(
            "저장하면서 뭔가 오류가 생겼어요. 담당 개발자에게 문의해주세요-"
          );
        });
    } else {
      this.show_snackbar("변경된 내용이 없어 저장하지 않습니다.");
    }
  }

  calc_score(input, weight) {
    let val = parseFloat(input);
    setTimeout(() => {
      let total = 0;
      for (var idx in this.state.entries) {
        let final = parseFloat(this.state.entries[idx].final_score);
        if (final) {
          total += final;
        }
      }
      this.setState(
        update(this.state, {
          total: { $set: parseFloat(total.toFixed(1)) },
        })
      );
    }, 500);

    return isNaN(val) ? null : parseFloat((val * weight).toFixed(1));
  }

  render() {
    return (
      <MuiThemeProvider>
        <Formsy.Form
          onValidSubmit={this.submit.bind(this)}
          onInvalidSubmit={(model, resetForm, invalidateForm) => {
            // console.log('onInvalidSubmit: ', model);
            this.show_snackbar(
              "형식에 맞지 않는 값이 있어, 저장할 수 없습니다."
            );
          }}
        >
          <div className="card">
            <div className="card-header">
              <h4>평가 점수</h4>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item">
                  <div className="row">
                    <div className="col-sm-5">등급</div>
                    <div className="col-sm-7">
                      <RadioButtonGroup
                        name="level"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          flexWrap: "wrap",
                        }}
                        valueSelected={this.state.level.input}
                        onChange={(e, v) => {
                          if (v !== this.state.level.input) {
                            this.setState(
                              update(this.state, {
                                level: {
                                  input: { $set: v },
                                  changed: { $set: new Date() },
                                },
                                canSave: { $set: true },
                              })
                            );
                          }
                        }}
                      >
                        {this.state.level.list.map((level, i) => {
                          return (
                            <RadioButton
                              value={level.level_no}
                              label={level.level_title}
                              key={i}
                              required
                              style={{ width: "auto", marginLeft: "20px" }}
                              className="score-radio"
                            />
                          );
                        })}
                      </RadioButtonGroup>
                    </div>
                  </div>
                </li>
                {this.state.entries.map((entry, i) => {
                  return (
                    <li className="list-group-item" key={i}>
                      <div className="row">
                        <div
                          className="col-sm-5"
                          onClick={(event) => {
                            let param = {
                              open: { $set: true },
                              anchorEl: { $set: event.currentTarget },
                              body: { $set: entry.entry_calc_legend },
                            };
                            setTimeout(
                              () => {
                                this.setState(
                                  update(this.state, { popover: param })
                                );
                              },
                              this.refs.popover.props.open ? 100 : 0
                            );
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {entry.entry_title}
                          <br />
                          (가중치: {entry.entry_weight})<br />
                          <label>
                            [변환점수:
                            {entry.final_score != null
                              ? entry.final_score
                              : "점수 입력 필요"}
                            ]
                          </label>
                        </div>
                        <div className="col-sm-7 text-right">
                          {entry.entry_input_min}
                          {" " + String.fromCharCode("8804") + " "}
                          <FormsyText
                            floatingLabelText="점수 입력"
                            defaultValue={entry.input}
                            inputStyle={{ textAlign: "center" }}
                            name={entry.entry_no}
                            style={{ width: "100px" }}
                            onChange={(e, val) => {
                              let final = this.calc_score(
                                val,
                                entry.entry_weight
                              );
                              this.setState(
                                update(this.state, {
                                  entries: {
                                    [i]: {
                                      input: { $set: val },
                                      changed: { $set: new Date() },
                                      final_score: { $set: final },
                                    },
                                  },
                                  canSave: { $set: true },
                                })
                              );
                              setTimeout(() => {
                                // console.log(this.state.entries);
                              }, 100);
                            }}
                            required
                            maxLength="10"
                            type="number"
                            min={entry.entry_input_min}
                            max={entry.entry_input_max}
                            validations={{
                              between: [
                                entry.entry_input_min,
                                entry.entry_input_max,
                              ],
                            }}
                            validationError=" "
                          />
                          {" " + String.fromCharCode("8804") + " "}
                          {entry.entry_input_max}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="card-footer">
              <div className="text-right">
                <label className="pull-left">
                  변환총점: {this.state.total}
                </label>
                <button
                  className="btn btn-info"
                  type="submit"
                  disabled={!this.state.canSave}
                  ref="btnSave"
                >
                  저장
                </button>
              </div>
            </div>
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

          <Popover
            style={{ whiteSpace: "pre", padding: "15px" }}
            open={this.state.popover.open}
            ref="popover"
            anchorEl={this.state.popover.anchorEl}
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            targetOrigin={{ horizontal: "left", vertical: "top" }}
            onRequestClose={() => {
              this.setState(
                update(this.state, {
                  popover: {
                    open: { $set: false },
                  },
                })
              );
            }}
            useLayerForClickAway={false}
            animated={false}
            animation={PopoverAnimationVertical}
          >
            {this.state.popover.body}
          </Popover>
        </Formsy.Form>
      </MuiThemeProvider>
    );
  }
}
