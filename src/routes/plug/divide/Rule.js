import React, { Component } from "react";
import { Modal, Form, Select, Input, Switch, Button, message } from "antd";
import { connect } from "dva";
import classnames from "classnames";
import styles from "../index.less";

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ global }) => ({
  platform: global.platform
}))
class AddModal extends Component {
  constructor(props) {
    super(props);
    const ruleConditions = props.ruleConditions || [
      {
        paramType: "",
        operator: "",
        paramName: "",
        paramValue: ""
      }
    ];

    let requestVolumeThreshold = "",
      errorThresholdPercentage = "",
      maxConcurrentRequests = "",
      sleepWindowInMilliseconds = "",
      groupKey = "",
      commandKey = "",
      loadbalance = "",
      timeout = "",
      upstreamList = [
        {
          upstreamHost: "",
          upstreamUrl: "",
          timeout: "",
          retry: "",
          weight: ""
        }
      ];

    if (props.handle) {
      const myHandle = JSON.parse(props.handle);
      requestVolumeThreshold = myHandle.requestVolumeThreshold;
      errorThresholdPercentage = myHandle.errorThresholdPercentage;
      maxConcurrentRequests = myHandle.maxConcurrentRequests;
      sleepWindowInMilliseconds = myHandle.sleepWindowInMilliseconds;
      groupKey = myHandle.groupKey;
      commandKey = myHandle.commandKey;
      loadbalance = myHandle.loadbalance;
      timeout = myHandle.timeout;
      upstreamList = myHandle.upstreamList;
    }

    this.state = {
      ruleConditions,
      requestVolumeThreshold,
      errorThresholdPercentage,
      maxConcurrentRequests,
      sleepWindowInMilliseconds,
      groupKey,
      commandKey,
      loadbalance,
      timeout,
      upstreamList
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, handleOk } = this.props;
    const {
      ruleConditions,
      requestVolumeThreshold,
      errorThresholdPercentage,
      maxConcurrentRequests,
      sleepWindowInMilliseconds,
      groupKey,
      commandKey,
      loadbalance,
      timeout,
      upstreamList
    } = this.state;

    form.validateFieldsAndScroll((err, values) => {
      const { name, matchMode, loged, enabled } = values;
      const handle = {
        requestVolumeThreshold,
        errorThresholdPercentage,
        maxConcurrentRequests,
        sleepWindowInMilliseconds,
        groupKey,
        commandKey,
        loadbalance,
        timeout,
        upstreamList
      };
      if (!err) {
        handleOk({
          name,
          matchMode,
          handle: JSON.stringify(handle),
          loged,
          enabled,
          sort: Number(values.sort),
          ruleConditions
        });
      }
    });
  };

  handleAdd = () => {
    let { ruleConditions } = this.state;
    ruleConditions.push({
      paramType: "",
      operator: "",
      paramName: "",
      paramValue: ""
    });
    this.setState({ ruleConditions });
  };

  divideHandleAdd = () => {
    let { upstreamList } = this.state;
    if (upstreamList) {
      upstreamList.push({
        upstreamHost: "",
        upstreamUrl: "",
        timeout: "",
        retry: "",
        weight: ""
      });
    } else {
      upstreamList = [];
    }

    this.setState({ upstreamList });
  };

  handleDelete = index => {
    let { ruleConditions } = this.state;
    if (ruleConditions && ruleConditions.length > 1) {
      ruleConditions.splice(index, 1);
    } else {
      message.destroy();
      message.error("至少有一个条件");
    }
    this.setState({ ruleConditions });
  };

  divideHandleDelete = index => {
    let { upstreamList } = this.state;
    if (upstreamList && upstreamList.length > 0) {
      upstreamList.splice(index, 1);
    }
    this.setState({ upstreamList });
  };

  conditionChange = (index, name, value) => {
    let { ruleConditions } = this.state;
    ruleConditions[index][name] = value;
    this.setState({ ruleConditions });
  };

  divideHandleChange = (index, name, value) => {
    let { upstreamList } = this.state;
    upstreamList[index][name] = value;
    this.setState({ upstreamList });
  };

  onHandleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    let {
      onCancel,
      form,
      platform,
      name = "",
      matchMode = "",
      loged = true,
      enabled = true,
      sort = ""
    } = this.props;
    const {
      ruleConditions,
      requestVolumeThreshold,
      errorThresholdPercentage,
      maxConcurrentRequests,
      sleepWindowInMilliseconds,
      groupKey,
      commandKey,
      loadbalance,
      timeout,
      upstreamList
    } = this.state;

    let {
      matchModeEnums,
      operatorEnums,
      paramTypeEnums,
      loadBalanceEnums
    } = platform;

    if (operatorEnums) {
      operatorEnums = operatorEnums.filter(item => {
        return item.support === true;
      });
    }

    if (paramTypeEnums) {
      paramTypeEnums = paramTypeEnums.filter(item => {
        return item.support === true;
      });
    }
    if (loadBalanceEnums) {
      loadBalanceEnums = loadBalanceEnums.filter(item => {
        return item.support === true;
      });
    }

    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 3 }
      },
      wrapperCol: {
        sm: { span: 21 }
      }
    };
    const formCheckLayout = {
      labelCol: {
        sm: { span: 18 }
      },
      wrapperCol: {
        sm: { span: 4 }
      }
    };
    return (
      <Modal
        width={800}
        centered
        title="规则"
        visible
        okText="确定"
        cancelText="取消"
        onOk={this.handleSubmit}
        onCancel={onCancel}
      >
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem label="名称" {...formItemLayout}>
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称" }],
              initialValue: name
            })(<Input placeholder="名称" />)}
          </FormItem>
          <FormItem label="匹配方式" {...formItemLayout}>
            {getFieldDecorator("matchMode", {
              rules: [{ required: true, message: "请选择匹配方式" }],
              initialValue: matchMode
            })(
              <Select>
                {matchModeEnums.map(item => {
                  return (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <div className={styles.ruleConditions}>
            <h3 className={styles.header}>条件:</h3>
            <div className={styles.content}>
              {ruleConditions.map((item, index) => {
                return (
                  <ul key={index}>
                    <li>
                      <Select
                        onChange={value => {
                          this.conditionChange(index, "paramType", value);
                        }}
                        value={item.paramType}
                        style={{ width: 110 }}
                      >
                        {paramTypeEnums.map(type => {
                          return (
                            <Option key={type.name} value={type.name}>
                              {type.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </li>
                    <li>
                      <Input
                        onChange={e => {
                          this.conditionChange(
                            index,
                            "paramName",
                            e.target.value
                          );
                        }}
                        value={item.paramName}
                        style={{ width: 110 }}
                      />
                    </li>
                    <li>
                      <Select
                        onChange={value => {
                          this.conditionChange(index, "operator", value);
                        }}
                        value={item.operator}
                        style={{ width: 110 }}
                      >
                        {operatorEnums.map(opearte => {
                          return (
                            <Option key={opearte.name} value={opearte.name}>
                              {opearte.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </li>

                    <li>
                      <Input
                        onChange={e => {
                          this.conditionChange(
                            index,
                            "paramValue",
                            e.target.value
                          );
                        }}
                        value={item.paramValue}
                        style={{ width: 110 }}
                      />
                    </li>
                    <li>
                      <Button
                        type="danger"
                        onClick={() => {
                          this.handleDelete(index);
                        }}
                      >
                        删除
                      </Button>
                    </li>
                  </ul>
                );
              })}
            </div>
            <div>
              <Button onClick={this.handleAdd} type="primary">
                新增
              </Button>
            </div>
          </div>
          <div className={styles.handleWrap}>
            <div className={styles.header}>
              <h3>处理: </h3>
            </div>
            <ul
              className={classnames({
                [styles.handleUl]: true,
                [styles.springUl]: true
              })}
            >
              <li>
                <Input
                  addonBefore={<div>跳闸最小请求数量</div>}
                  value={requestVolumeThreshold}
                  style={{ width: 320 }}
                  placeholder="requestVolumeThreshold"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("requestVolumeThreshold", value);
                  }}
                />
              </li>
              <li>
                <Input
                  addonBefore={<div>错误半分比阀值</div>}
                  value={errorThresholdPercentage}
                  style={{ width: 320 }}
                  placeholder="errorThresholdPercentage"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("errorThresholdPercentage", value);
                  }}
                />
              </li>
              <li>
                <Input
                  addonBefore={<div>最大并发量</div>}
                  value={maxConcurrentRequests}
                  style={{ width: 280 }}
                  placeholder="maxConcurrentRequests"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("maxConcurrentRequests", value);
                  }}
                />
              </li>
              <li>
                <Input
                  addonBefore={<div>跳闸休眠时间(单位毫秒)</div>}
                  value={sleepWindowInMilliseconds}
                  style={{ width: 360 }}
                  placeholder="sleepWindowInMilliseconds"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("sleepWindowInMilliseconds", value);
                  }}
                />
              </li>
              <li>
                <Input
                  addonBefore={<div>分组Key</div>}
                  value={groupKey}
                  style={{ width: 320 }}
                  placeholder="groupKey"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("groupKey", value);
                  }}
                />
              </li>
              <li>
                <Input
                  addonBefore={<div>命令Key</div>}
                  value={commandKey}
                  style={{ width: 320 }}
                  placeholder="commandKey"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("commandKey", value);
                  }}
                />
              </li>
              <li style={{ marginTop: 14 }} className={styles.loadbalanceLine}>
                <div className={styles.loadText}>负载策略</div>
                <Select
                  onChange={value => {
                    this.onHandleChange("loadbalance", value);
                  }}
                  value={loadbalance}
                  style={{ width: 160 }}
                  placeholder="loadbalance"
                >
                  {loadBalanceEnums.map(item => {
                    return (
                      <Option key={item.name} value={item.name}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </li>
              <li style={{ marginTop: 14 }}>
                <Input
                  addonBefore={<div>超时时间</div>}
                  value={timeout}
                  style={{ width: 250 }}
                  placeholder="timeout"
                  onChange={e => {
                    const value = e.target.value;
                    this.onHandleChange("timeout", value);
                  }}
                />
              </li>
            </ul>
          </div>
          <div className={styles.divideHandle}>
            <div className={styles.header}>
              <h3>upstreamList: </h3>
            </div>
            <div className={styles.content}>
              {upstreamList.map((item, index) => {
                return (
                  <ul key={index}>
                    <li>
                      <Input
                        onChange={e => {
                          this.divideHandleChange(
                            index,
                            "upstreamHost",
                            e.target.value
                          );
                        }}
                        placeholder="upstreamHost"
                        value={item.upstreamHost}
                        style={{ width: 120 }}
                      />
                    </li>
                    <li>
                      <Input
                        onChange={e => {
                          this.divideHandleChange(
                            index,
                            "upstreamUrl",
                            e.target.value
                          );
                        }}
                        placeholder="upstreamUrl"
                        value={item.upstreamUrl}
                        style={{ width: 120 }}
                      />
                    </li>
                    <li>
                      <Input
                        onChange={e => {
                          this.divideHandleChange(
                            index,
                            "timeout",
                            e.target.value
                          );
                        }}
                        placeholder="timeout"
                        value={item.timeout}
                        style={{ width: 80 }}
                      />
                    </li>

                    <li>
                      <Input
                        onChange={e => {
                          this.divideHandleChange(
                            index,
                            "retry",
                            e.target.value
                          );
                        }}
                        placeholder="retry"
                        value={item.retry}
                        style={{ width: 80 }}
                      />
                    </li>
                    <li>
                      <Input
                        onChange={e => {
                          this.divideHandleChange(
                            index,
                            "weight",
                            e.target.value
                          );
                        }}
                        placeholder="weight"
                        value={item.weight}
                        style={{ width: 80 }}
                      />
                    </li>
                    <li>
                      <Button
                        type="danger"
                        onClick={() => {
                          this.divideHandleDelete(index);
                        }}
                      >
                        删除
                      </Button>
                    </li>
                  </ul>
                );
              })}
            </div>
            <div>
              <Button onClick={this.divideHandleAdd} type="primary">
                新增
              </Button>
            </div>
          </div>
          <div className={styles.layout}>
            <FormItem
              style={{ margin: "0 30px" }}
              {...formCheckLayout}
              label="打印日志"
            >
              {getFieldDecorator("loged", {
                initialValue: loged,
                valuePropName: "checked",
                rules: [{ required: true }]
              })(<Switch />)}
            </FormItem>
            <FormItem {...formCheckLayout} label="是否开启">
              {getFieldDecorator("enabled", {
                initialValue: enabled,
                valuePropName: "checked",
                rules: [{ required: true }]
              })(<Switch />)}
            </FormItem>
          </div>

          <FormItem label="执行顺序" {...formItemLayout}>
            {getFieldDecorator("sort", {
              initialValue: sort,
              rules: [
                {
                  required: true,
                  message: "请输入1-100数字"
                },
                {
                  pattern: /^([1-9][0-9]{0,1}|100)$/,
                  message: "请输入1-100数字"
                }
              ]
            })(<Input placeholder="可以填写1-100之间的数字标志执行先后顺序" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AddModal);
