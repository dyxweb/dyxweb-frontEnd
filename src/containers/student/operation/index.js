/**
 * 学生操作页面
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Form, Input, Radio, InputNumber, Button, message } from 'antd';
import lodashOmit from 'lodash.omit';
import { studentStatus } from 'constants/student.js';
import request from 'utils/request';
import styles from './index.less';

@Form.create(StudentOperation)
@CSSModules(styles)
export default class StudentOperation extends Component {
  state = { 
    studentDetail: {}, // 学生的信息
  }

  componentDidMount() {
    const { operationType } = this.props;
    const { studentId } = this.props.match.params;
    // 处于编辑状态下时赋初始值
    if (operationType === 'edit') {
      request.get(`${QUERYHOST}/getStudentDetail`, { id: studentId }).then(res => {
        if (res && res.success) {
          this.setState({
            studentDetail: res.data,
          });
          // 保留除studentId的表单项
          const formValue = lodashOmit(res.data, ['studentId']);
          this.props.form.setFieldsValue(formValue);
        }
      })
    }
  }

  // 自定义电话号码校验
  testPhone = (rule, value, callback) => {
    if (value && !(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(value))) {
      callback('请正确填写电话号码');
    } else {
      callback();
    }
  }

  // 接口保存学生信息
  operationStudent = studentInfo => {
    const { operationType } = this.props;
    const requestUrl = operationType === 'add' ? `${QUERYHOST}/addStudent` : `${QUERYHOST}/editStudent`;
    request.post(requestUrl, studentInfo).then(res => {
      // 成功之后返回学生列表
      if (res && res.success) {
        message.success(operationType === 'add' ? '添加成功' : '编辑成功');
        this.onCancel();
      }
    })
  }

  // 保存学生信息
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { operationType } = this.props;
        const { studentId } = this.props.match.params;
        let studentInfo = values;
        if (operationType === 'edit') {
          studentInfo = { studentValues: values, id: studentId };
        }
        this.operationStudent(studentInfo);
      }
    });
  }

  // 取消按钮
  onCancel = () => {
    this.props.history.push('/trainning/student')
  }

  render() {
    const { operationType } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div styleName="student-operation">
        <div styleName="top-title">
          <div styleName="title">{operationType === 'add' ? '新添学生' : '编辑学生'}</div>
          <Button onClick={this.onCancel}>取消</Button>
        </div>
        <Form layout="vertical" onSubmit={e => this.handleSubmit(e)}>
          <Form.Item label="学生姓名">
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请填写学生姓名' },
            ],
            })(<Input placeholder="请填写学生姓名" />)}
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
          <Form.Item label="学校">
            {getFieldDecorator('school', {
              rules: [
                { required: true, message: '请填写学校' },
              ],
            })(<Input placeholder="请填写学校" />)}
          </Form.Item>
          <Form.Item label="家长姓名">
            {getFieldDecorator('parentName', {
              rules: [
                { required: true, message: '请填写家长姓名' },
            ],
            })(<Input placeholder="请填写家长姓名" />)}
          </Form.Item>
          <Form.Item label="家长性别">
            {getFieldDecorator('parentSex', {
              rules: [
                { required: true, message: '请填写家长性别' },
              ],
            })(<Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>)}
          </Form.Item>
          <Form.Item label="家长手机号">
            {getFieldDecorator('parentPhone', {
              rules: [
                { required: true, message: '请填写家长手机号' },
                { validator: this.testPhone },
              ],
            })(<Input placeholder="请填写家长手机号" />)}
          </Form.Item>
          <Form.Item label="所报科目">
            {getFieldDecorator('subject', {
              rules: [
                { required: true, message: '请填写所报科目' },
            ],
            })(<Input placeholder="请填写所报科目" />)}
          </Form.Item>
          <Form.Item label="状态">
            {getFieldDecorator('status', {
              rules: [
                { required: true, message: '请填写当前状态' },
              ],
            })(<Radio.Group options={studentStatus} />)}
          </Form.Item>
        </Form>
          <div styleName="submit-button">
            <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          </div>
      </div>
    )
  }
}