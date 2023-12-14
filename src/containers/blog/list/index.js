/**
 * 文章列表页面
 */
import React, { Component, Fragment } from 'react';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import { Button, message, Popconfirm, Input, Tag, Spin, Modal } from 'antd';
import moment from 'moment';
import request from 'utils/request';
import styles from './index.less';

const { Search } = Input;
const mapStateToProps = state => ({
  permission: state.loginStore.permission, // 登录人的权限
})

@connect(mapStateToProps, null)
@CSSModules(styles)
export default class BlogList extends Component {
  state = {
    blogData: [], // 文章数据
    loading: false, // 接口loading状态
  }

  componentDidMount() {
    this.getBlogList();
  }

  // 获取文章列表
  getBlogList = searchValue => {
    this.setState({
      loading: true,
    });
    request.get(`${QUERYHOST}/getBlogList`, searchValue ? { searchValue } : {}).then(res => {
      if (res && res.success) {
        this.setState({
          blogData: res.data || [],
          loading: false,
        });
      }
    })
  }

  // 搜索
  onSearch = value => {
    this.getBlogList(value);
  }

  // 跳转到添加文章页面
  addBlog = () => {
    this.props.history.push('/blog/add');
  }

  // 跳转到编辑文章页面
  editBlog = blogId => {
    this.props.history.push(`/blog/${blogId}/edit`);
  }

  // 跳转到文章详情页面
  blogDetail = blogId => {
    this.props.history.push(`/blog/${blogId}/detail`);
  }

  // 删除文章
  deleteBlog = blogId => {
    request.get(`${QUERYHOST}/deleteBlog`, { id: blogId }).then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.getBlogList();
      }
    })
  }

  render() {
    const { blogData, loading } = this.state;
    const { permission } = this.props;
    const canOpertion = permission === 'manager';
    return (
      <div styleName="blog-list">
        <div styleName="top-operation">
          <Search
            placeholder="可根据文章名称进行搜索"
            onSearch={this.onSearch}
          />
          {canOpertion && <Button type="primary" onClick={this.addBlog}>添加文章</Button>}
        </div>
        <Spin spinning={loading}>
          {blogData.map((item, index) => (
            <div styleName="blog-item" key={index} onClick={() => this.blogDetail(item.id)}>
              <div styleName="title-box">
                <div styleName="title">{item.title}</div>
                <div styleName="time">{moment(item.update_date).format('YYYY-MM-DD HH:mm:ss')}</div>
              </div>
              <div styleName="bottom-operation" onClick={e => e.stopPropagation()}>
                <Tag color="blue">{item.tags}</Tag>
                {canOpertion && <Fragment>
                  <span styleName="button" onClick={() => this.editBlog(item.id)}>编辑</span>
                  <Popconfirm
                    title="您确定要删除吗?"
                    onConfirm={() => this.deleteBlog(item.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <span type="link" styleName="button">删除</span>
                  </Popconfirm>
                </Fragment>}
              </div>
            </div>
          ))}
        </Spin>
      </div>
    )
  }
}
