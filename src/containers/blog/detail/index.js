/**
 * 文章展示页面
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import showdown from 'showdown';
import moment from 'moment';
import request from 'utils/request';
import styles from './index.less';

const converter = new showdown.Converter();

@CSSModules(styles)
export default class BlogDetail extends Component {
  state = {
    blogDetail: {},
  }

  componentDidMount() {
    const { blogId } = this.props.match.params;
    request.get(`${QUERYHOST}/getBlogDetail`, { id: blogId }).then(res => {
      if (res && res.success) {
        this.setState({
          blogDetail: res.data,
        })  
      }
    })
  }

  render() {
    const { blogDetail } = this.state;
    return (
      <div styleName="blog-detail">
        <div styleName="detail">
          <div styleName="des">
            <span styleName="tag">{blogDetail.tag}</span>
            <span>{moment(blogDetail.createTime).format('YYYY-MM-DD')}</span>
          </div>
          <div styleName="title">{blogDetail.title}</div>
          <div id="content" styleName="content" dangerouslySetInnerHTML = {{ __html:converter.makeHtml(blogDetail.content) }} />
        </div>
      </div>
    )
  }
}