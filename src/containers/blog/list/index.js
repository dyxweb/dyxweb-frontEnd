/**
 * 文章列表页面
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import { Button, Tabs, message } from 'antd';
import moment from 'moment';
import request from 'utils/request';
import _ from 'lodash';
import styles from './index.less';

const { TabPane } = Tabs;

@CSSModules(styles)
export default class BlogList extends Component {
  state = {
    blogData: [], // 文章数据
    tagData: [], // 文章标签数据
  }

  componentDidMount() {
    this.getBlogList();
    this.getBlogTagList();
  }

  // 获取文章列表
  getBlogList = tag => {
    const params = tag ? { tag: tag } : {};
    request.get(`${QUERYHOST}/getBlogList`, params).then(res => {
      if (res && res.success) {
        this.setState({
          blogData: res.data || [],
        });
      }
    })
  }

  // 获取文章标签列表
  getBlogTagList = () => {
    request.get(`${QUERYHOST}/getTagList`).then(res => {
      if (res && res.success) {
        const tags = _.uniq((Array.isArray(res.data) ? res.data : []).map(item => item.tag));
        // 直接用于tab数据
        const tagData = tags.map(item => ({ value: item, label: item }));
        tagData.unshift({ label: '所有', value: 'all' })
        this.setState({
          tagData,
        })
      }
    })
  }

  // tab标签切换
  onTagChange = value => {
    this.getBlogList(value === 'all' ? false : value);
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
    window.open(`/blog/${blogId}/detail`);
    // this.props.history.push(`/blog/${blogId}/detail`);
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
    const { blogData, tagData } = this.state;
    return (
      <div styleName="blog">
        <div styleName="blog-list">
          {_.isEmpty(tagData) || <Tabs
            onChange={this.onTagChange}
            tabBarExtraContent={<Button onClick={this.addBlog}>添加文章</Button>}
          >
            {tagData.map(item => (
              <TabPane tab={item.label} key={item.value} />
            ))}
          </Tabs>}
          {blogData.map((item, index) => (
            <div styleName="blog-item" key={index}>
              <div styleName="top-des">
                <div styleName="des">
                  <span styleName="tag">{item.tag}</span>
                  <span>{moment(item.createTime).format('YYYY-MM-DD')}</span>
                </div>
                <div styleName="right-operation">
                  <Button type="link" onClick={() => this.editBlog(item.id)}>编辑</Button>
                  <Button type="link" onClick={() => this.deleteBlog(item.id)}>删除</Button>
                </div>
              </div>
              <div styleName="title" onClick={() => this.blogDetail(item.id)}>{item.title}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
