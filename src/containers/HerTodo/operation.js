/**
 * 代办操作
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Icon, Form, Input, Button, Checkbox, message } from 'antd';
import request from 'utils/request';
// import styles from './index.less';

const FormItem = Form.Item;
@Form.create(Operation)
// @CSSModules(styles)
export default class Operation extends Component {
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        const params = {
          name: values.name,
          description: values.description,
          status: 1,
        }
        request.post(`${QUERYHOST}/addHerTodo`, params).then(res => {
          if (res && res.success) {
            this.props.history.push('/yingying');
            message.success('保存成功了呦');
          } else {
            message.error('保存失败');
          }
        })
      }
    });
  }

  // 取消返回列表
  onCancel = () => {
    this.props.history.push('/yingying');
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <Form onSubmit={this.onSubmit} style={{ flexGrow: 1 }}>
          <FormItem label="小仙女想做什么呀">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入代办标题' }],
            })(
              <Input type="text" />
            )}
          </FormItem>
          <FormItem label="小仙女有什么想法呀">
            {getFieldDecorator('description')(
              <Input.TextArea type="text"  />
            )}
          </FormItem>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{ marginLeft: '12px' }} onClick={this.onCancel}>取消</Button>
          </div>
        </Form>
      </div>
    );
  }
}