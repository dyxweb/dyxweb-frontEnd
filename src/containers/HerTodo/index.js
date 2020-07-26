import React, { Component } from 'react';
import { message, Button } from 'antd';
import CSSModules from 'react-css-modules';
import _ from 'lodash';
import request from 'utils/request';
import { todoStatus } from 'constants/todo';
import styles from './index.less';

@CSSModules(styles)
export default class HerTodo extends Component {
  state = {
    todoList: [],
    loading: false,
  }
  
  componentDidMount() {
    this.getTodoList();
  }

  // 获取代办列表
  getTodoList = status => {
    this.setState({
      loading: true,
    });
    request.get(`${QUERYHOST}/getHerTodo`, status ? { status } : {}).then(res => {
      if (res && res.success) {
        this.setState({
          todoList: res.data || [],
          loading: false,
        });
      }
    })
  }

  // 删除代办
  deleteTodo = todoId => {
    request.get(`${QUERYHOST}/deleteHerTodo`, { id: todoId }).then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.getTodoList();
      }
    })
  }

  getStatus = (value, key) => {
    const matchData = todoStatus.find(item => item.value === Number(value));
    return _.get(matchData, [key]);
  }

  render() {
    const { todoList, loading } = this.state;
    console.log(todoList, loading);
    return (
      <div>
        {loading ?
          <div>小仙女耐心等待一下</div> :
          <div>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <Button type="primary" onClick={() => { this.props.history.push('/yingying/add')}}>添加</Button>
            </div>
            {todoList.map(item => (
              <div styleName="item" key={item.id}>
                <div styleName="title">{item.name}</div>
                {item.description && <div styleName="des">{item.description}</div>}
                <div styleName="operation">
                  <div
                    styleName="status"
                    style={{ color: this.getStatus(item.status, 'color'), border: `1px solid ${this.getStatus(item.status, 'color')}` }}
                  >
                    {this.getStatus(item.status, 'label')}
                  </div>
                  <div onClick={() => this.deleteTodo(item.id)}>删除</div>
                </div>
              </div>
            ))}
          </div>
          
        }
      </div>
    );
  }
}
