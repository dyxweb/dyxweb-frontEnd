/**
 * 老师操作页面
 */
import React, { Component } from 'react';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import lodashOmit from 'lodash.omit';
import lodashCloneDeep from 'lodash.clonedeep';
import { Form, Input, Radio, InputNumber, Button, DatePicker, message } from 'antd';
import request from 'utils/request';
import styles from './index.less';

@Form.create(TeacherOperation)
@CSSModules(styles)
export default class TeacherOperation extends Component {
  state = { 
    teacherDetail: {}, // 教师的信息
  }

  componentDidMount() {
    const { operationType } = this.props;
    const { teacherId } = this.props.match.params;
    // 处于编辑状态下时赋初始值
    if (operationType === 'edit') {
      request.get(`${QUERYHOST}/getTeacherDetail`, { id: teacherId }).then(res => {
        if (res && res.success) {
          this.setState({
            teacherDetail: res.data,
          });
          // 保留除id的表单项
          const formValue = lodashOmit(res.data, ['id']);
          // datePicker赋初始值必须是moment对象的形式
          formValue.addTime = moment(res.data.addTime, 'YYYY-MM-DD');
          this.props.form.setFieldsValue(formValue);
        }
      })
    }
  }

  // 自定义电话号码校验
  testPhone = (rule, value, callback) => {
    const form = this.props.form;
    if (value && !(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(value))) {
      callback('请正确填写电话号码');
    } else {
      callback();
    }
  }

  // 接口保存教师信息
  operationTeacher = teacherInfo => {
    const { operationType } = this.props;
    const requestUrl = operationType === 'add' ? `${QUERYHOST}/addTeacher` : `${QUERYHOST}/editTeacher`;
    request.post(requestUrl, teacherInfo).then(res => {
      // 成功之后返回教师列表
      if (res && res.success) {
        message.success(operationType === 'add' ? '添加成功' : '编辑成功');
        this.onCancel();
      }
    })
  }

  // 保存老师信息
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { operationType } = this.props;
        const { teacherId } = this.props.match.params;
        values.addTime = moment(values.addTime).format('YYYY-MM-DD');
        // 接口的参数
        let params = lodashCloneDeep(values);
        if (operationType === 'edit') {
          params.id = teacherId;
        }
        this.operationTeacher(params);
      }
    });
  }

  // 取消按钮
  onCancel = () => {
    this.props.history.push('/trainning/teacher')
  }

  render() {
    const { operationType } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div styleName="teacher-operation">
        <div styleName="top-title">
          <div styleName="title">{operationType === 'add' ? '新添教师' : '编辑教师'}</div>
          <Button onClick={this.onCancel}>取消</Button>
        </div>
        <Form layout="vertical" onSubmit={e => this.handleSubmit(e)}>
          <Form.Item label="教师姓名">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请填写教师姓名' },
              ],
            })(<Input placeholder="请填写教师姓名" />)}
          </Form.Item>
          <Form.Item label="年龄">
            {getFieldDecorator('age', {
              rules: [
                { required: true, message: '请填写年龄' },
              ],
            })(<InputNumber min={1} max={100} />)}
          </Form.Item>
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              rules: [
                { required: true, message: '请填写性别' },
              ],
            })(<Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>)}
          </Form.Item>
          <Form.Item label="联系方式">
            {getFieldDecorator('phone', {
              rules: [
                { required: true, message: '请填写联系方式' },
                { validator: this.testPhone },
              ],
            })(<Input placeholder="请填写联系方式" />)}
          </Form.Item>
          <Form.Item label="授课科目">
            {getFieldDecorator('subject', {
              rules: [
                { required: true, message: '请填写授课科目' },
            ],
            })(<Input placeholder="请填写所报科目" />)}
          </Form.Item>
          <Form.Item label="入职时间">
            {getFieldDecorator('addTime', {
              rules: [{ required: true, message: '请选择时间' }],
            })(
              <DatePicker
                style={{ width: '100%' }}
                getPopupContainer={trigger => trigger.parentNode}
                format='YYYY-MM-DD'
              />
            )}
          </Form.Item>
        </Form>
          <div styleName="submit-button">
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          </div>
      </div>
    )
  }
}