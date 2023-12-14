/**
 * 登录或注册的表单
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import CryptoJS from 'crypto-js';
import { Icon, Form, Input, Button, Checkbox, message } from 'antd';
import { connect } from 'react-redux';
import lodashGet from 'lodash.get';
import request from 'utils/request';
import { setCookie, getCookie, delCookie } from 'utils/cookie';
import { changePermission } from '../../redux/login/actions';
import styles from './index.less';

const FormItem = Form.Item;
const mapDispatchToProps = dispatch => ({
  dispatch,
})

@connect(null, mapDispatchToProps)
@Form.create(Login)
@CSSModules(styles)
export default class Login extends Component {
  state = {
    type: 'login', // 默认是登录
  }

  // 如果保存了用户名和密码则直接显示
  componentDidMount() {
    this.props.form.setFields({
      name:{
        value: getCookie("name") || '',
      },
      password:{
        value: getCookie("password") ? this.decryptPassword(getCookie("password")) : '',
      },
    })
  }

  // 加密
  encryptPassword = value => {
    return CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse("dyxweb97"), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
  }

  // 解密
  decryptPassword = value => {
    return CryptoJS.AES.decrypt(value, CryptoJS.enc.Utf8.parse('dyxweb97'), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  // 登录
  onLogin = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        values.password = this.encryptPassword(values.password);
        // 校验用户名和密码
        request.post(`${QUERYHOST}/login`, values).then(res => {
          if (res && res.success) {
            this.props.dispatch({
              type: 'login'
            });
            this.props.dispatch(changePermission(lodashGet(res, 'data.permission') || 'normal'));
            message.success('登陆成功');
            this.props.colseDialogFunc();
            setCookie("islogin", 1, 3);
            setCookie("token", lodashGet(res, 'data.token'), 3);
            // 记住用户名
            setCookie("name", values.name, 7);
            // 如果选择记住密码则保存密码
            if (values.remember) {
              setCookie('password', values.password, 7)
            } else {
              delCookie('password')
            }
          } else {
            message.error('用户名或者密码错误');
          }
        })
      } 
    });
  }

  // 注册
  onRegist = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(!err) {
        // 注册用户
        const params = {
          name: values.name,
          password: this.encryptPassword(values.password),
          permission: 'normal',
        }
        request.post(`${QUERYHOST}/addUser`, params).then(res => {
          if (res && res.success) {
            message.success('注册成功');
            // 注册成功之后使用注册的用户信息赋值登录页面
            this.setState({
              type: 'login',
            }, () => {
              this.props.form.setFieldsValue({
                name: values.name,
                password: values.password,
              })
            })
          }
        })
      }
    });
  }  

  // 点击注册按钮(置空表单项内容)
  onRegistClick = () => {
    this.setState({
      type: 'regist',
    }, () => {
      this.props.form.resetFields();
    })
  }

  render() {
    const { form } = this.props;
    const { type } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div styleName="login-body">
        <section styleName="login-form">
          <Form onSubmit={type === 'login' ? this.onLogin : this.onRegist}>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input type="text" addonBefore={<Icon type="user" />} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }]
              })(
                <Input type="password" addonBefore={<Icon type="lock"/>} />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              {/* type为登录下才显示注册按钮 */}
              {type === 'login' && <Button type="link" onClick={this.onRegistClick}>注册</Button>}
            </FormItem>
            <Button styleName="login-button" type="primary" htmlType="submit">{type === 'login' ? '登录' : '注册'}</Button>
          </Form>
        </section>
      </div>
    );
  }
}