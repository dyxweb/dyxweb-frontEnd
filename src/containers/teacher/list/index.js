/**
 * 老师列表页面
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Table, Button, Input, message } from 'antd';
import request from 'utils/request';
import styles from './index.less';

const { Search } = Input;
@CSSModules(styles)
export default class TeacherList extends Component {
  state = {
    teacherData: [], // 教师数据
    searchValue: '', // 搜索框输入的值，可能并不是真实的搜索值
    searchKey: '', // 真实的搜索值
  }

  componentDidMount() {
    this.getTeacherList();
  }

  // 获取学生列表
  getTeacherList = () => {
    request.get(`${QUERYHOST}/getTeacherList`).then(res => {
      if (res && res.success) {
        this.setState({
          teacherData: res.data || [],
        });
      }
    })
  }

  // 搜索框内容改变
  onSearchChange = e => {
    this.setState({
      searchValue: e.target.value,
    })
  }

  // 搜索
  onSearch = value => {
    this.setState({
      searchKey: value,
    })
  }

  // 重置搜索条件
  onReset = () => {
    this.setState({
      searchValue: '',
      searchKey: '',
    })
  }

  // 跳转到添加教师页面
  addTeacher = () => {
    this.props.history.push('/trainning/teacher/add')
  }

  // 跳转到编辑教师页面
  editTeacher = tearcherId => {
    this.props.history.push(`/trainning/teacher/${tearcherId}/edit`);
  }

  // 删除教师
  deleteTeacher = tearcherId => {
    request.get(`${QUERYHOST}/deleteTeacher`, { id: tearcherId }).then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.getTeacherList();
      }
    })
  }

  // 渲染操作列
  renderOperationColumn = (value, record) => (
    <span>
      <Button
        type="link"
        onClick={() => this.editTeacher(record.id)}
      >
        编辑
      </Button>
      {/* 暂时隐藏删除按钮，保留所有学生信息，用于后续营销，有教师状态来分辨 */}
      <Button
        type="link"
        onClick={() => this.deleteTeacher(record.id)}
      >
        删除
      </Button>
    </span>
  )

  render() {
    const { searchValue, teacherData } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '授课科目',
        dataIndex: 'subject',
        key: 'subject',
      },
      {
        title: '入职时间',
        dataIndex: 'addTime',
      },
      {
        title: '操作',
        render: this.renderOperationColumn,
      },
    ];
    return (
      <div styleName="teacher-list">
        <div styleName="top-operation">
          <div>
            <Search
              value={searchValue}
              placeholder="请输入学生姓名"
              onChange={this.onSearchChange}
              onSearch={this.onSearch}
              enterButton
              style={{ width: '240px' }}
            />
            <Button
              style={{ marginLeft: '16px' }}
              onClick={this.onReset}
            >
              重置
            </Button>
          </div>
          <Button type="primary" onClick={this.addTeacher}>添加老师</Button>
        </div>
        <Table
          columns={columns}
          dataSource={teacherData}
          rowKey={record => record.id}
        />
      </div>
    )
  }
}