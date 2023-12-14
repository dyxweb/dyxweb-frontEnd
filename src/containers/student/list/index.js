/**
 * 学生列表页面
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Table, Button, Input, message, Popconfirm } from 'antd';
import request from 'utils/request';
import styles from './index.less';

const { Search } = Input;
@CSSModules(styles)
export default class StudentList extends Component {
  state = {
    studentData: [], // 学生数据
    searchValue: '', // 搜索框输入的值，可能并不是真实的搜索值
    searchKey: '', // 搜索框输入的值，可能并不是真实的搜索值
  }

  componentDidMount() {
    this.getStudentList();
  }

  // 获取学生列表
  getStudentList = () => {
    const { searchKey } = this.state;
    request.get(`${QUERYHOST}/getStudentList`, searchKey ? { searchKey } : {}).then(res => {
      if (res && res.success) {
        this.setState({
          studentData: res.data || [],
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
      searchKey: value
    }, () => this.getStudentList())
  }

  // 重置搜索条件
  onReset = () => {
    this.setState({
      searchValue: '',
      searchKey: '',
    }, () => this.getStudentList())
  }

  // 跳转到添加学生页面
  addStudent = () => {
    this.props.history.push('/trainning/student/add');
  }

  // 跳转到编辑学生页面
  editStudent = id => {
    this.props.history.push(`/trainning/student/${id}/edit`);
  }

  // 删除学生
  deleteStudent = id => {
    request.get(`${QUERYHOST}/deleteStudent`, { id }).then(res => {
      if (res && res.success) {
        message.success('删除成功')
        this.getStudentList();
      }
    })
  }

  // 渲染操作列
  renderOperationColumn = (text, record) => (
    <span>
      <Button
        type="link"
        onClick={() => this.editStudent(record.id)}
      >
        编辑
      </Button>
      <Popconfirm
        title="您确定要删除吗?"
        onConfirm={() => this.deleteStudent(record.id)}
        okText="确定"
        cancelText="取消"
      >
        <Button type="link">删除</Button>
      </Popconfirm>
    </span>
  )

  // 渲染报名记录列
  renderRecordColumn = () => (
    <Button type="link">查看详情</Button>
  )

  render() {
    const { searchValue, studentData } = this.state;
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
        title: '学校',
        dataIndex: 'school',
        key: 'school',
      },
      {
        title: '家长姓名',
        dataIndex: 'parentName',
        key: 'parentName',
      },
      {
        title: '家长性别',
        dataIndex: 'parentSex',
        key: 'parentSex',
      },
      {
        title: '家长电话',
        dataIndex: 'parentPhone',
        key: 'parentPhone',
      },
      {
        title: '所报科目',
        dataIndex: 'subject',
        key: 'subject',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '报名记录',
        render: this.renderRecordColumn,
      },
      {
        title: '操作',
        render: this.renderOperationColumn,
      },
    ];
    return (
      <div styleName="student-list">
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
          <Button type="primary" onClick={this.addStudent}>添加学生</Button>
        </div>
        <Table
          columns={columns}
          dataSource={studentData}
          rowKey={record => record.id}
        />
      </div>
    )
  }
}