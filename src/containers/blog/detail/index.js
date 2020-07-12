/**
 * 文章展示页面
 */
import React, { Component, Fragment } from 'react';
import CSSModules from 'react-css-modules';
import { message, Popconfirm, Tag, Spin } from 'antd';
import hljs from 'highlight.js'
import { connect } from 'react-redux';
import showdown from 'showdown';
import moment from 'moment';
import request from 'utils/request';
import 'styles/highlight.css';
import styles from './index.less';

const converter = new showdown.Converter();
const mapStateToProps = state => ({
  permission: state.loginStore.permission, // 登录人的权限
})

@connect(mapStateToProps, null)
@CSSModules(styles)
export default class BlogDetail extends Component {
  state = {
    blogDetail: {}, // blog详情信息
    loading: false, // 接口loading状态
  }

  componentDidMount() {
    const { blogId } = this.props.match.params;
    this.setState({
      loading: true,
    });
    request.get(`${QUERYHOST}/getBlogDetail`, { id: blogId }).then(res => {
      if (res && res.success) {
        this.setState({
          blogDetail: res.data,
          loading: false,
        }, () => this.hightLight())  
      }
    })
  }

  // 代码高亮
  hightLight = () => {
    const preTags = document.getElementById('blog-content').getElementsByTagName('pre');
    (Array.from(preTags) || []).forEach(item => hljs.highlightBlock(item));
  }

  // 回到列表页
  toList = () => {
    this.props.history.push(`/blog`);
  }

  // 跳转到编辑文章页面
  editBlog = () => {
    const { blogId } = this.props.match.params;
    this.props.history.push(`/blog/${blogId}/edit`);
  }

  // 删除文章
  deleteBlog = () => {
    const { blogId } = this.props.match.params;
    request.get(`${QUERYHOST}/deleteBlog`, { id: blogId }).then(res => {
      if (res && res.success) {
        message.success('删除成功');
        this.toList();
      }
    })
  }

  render() {
    const { blogDetail, loading } = this.state;
    const { permission } = this.props;
    const canOpertion = permission === 'manager';
    return (
      <div styleName="blog-detail">
        <Spin spinning={loading}>
          <div styleName="detail">
          <div styleName="operation">
            <div>
              <Tag color="blue">{blogDetail.tags}</Tag>
              <span styleName="time">{moment(blogDetail.update_date).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
            <div>
              {canOpertion && <Fragment>
                <span styleName="button" onClick={this.editBlog}>编辑</span>
                <Popconfirm
                  title="您确定要删除吗?"
                  onConfirm={this.deleteBlog}
                  okText="确定"
                  cancelText="取消"
                >
                  <span type="link" styleName="button">删除</span>
                </Popconfirm>
              </Fragment>}
              <span styleName="button" onClick={this.toList}>返回博客列表</span>
            </div>
          </div>
          <div styleName="title">{blogDetail.title}</div>
          <div id="blog-content" styleName="content" dangerouslySetInnerHTML = {{ __html:converter.makeHtml(blogDetail.content) }} />
        </div>
        </Spin>
      </div>
    )
  }
}