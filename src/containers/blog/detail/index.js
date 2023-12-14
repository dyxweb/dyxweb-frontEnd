/**
 * 文章展示页面
 */
import React, { Component, Fragment } from 'react';
import CSSModules from 'react-css-modules';
import { message, Popconfirm, Tag, Message, Spin } from 'antd';
import hljs from 'highlight.js'
import { connect } from 'react-redux';
import showdown from 'showdown';
import moment from 'moment';
import request from 'utils/request';
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
    catalog: [], // 目录的内容
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
    });
  }

  componentWillUnMount() {
    Array.from(document.querySelectorAll('.pre-code')).removeEventListener('click', this.copyCode);
  }

  // 复制代码
  copyCode = (codeDom) => {
    const code = codeDom && codeDom.innerText;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        Message.success("复制成功");
      },  (err) => {
        Message.error("复制失败");
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        Message.success("复制成功");
      } catch (err) {
        Message.error("复制失败");
      }
      document.body.removeChild(textArea) 
    }
  };

  

  // 代码高亮
  hightLight = () => {
    const content = document.getElementById('blog-content');
    const preTags = content.getElementsByTagName('pre');
    var divTag = document.createElement("div");
    divTag.setAttribute("class", "pre-code");
    divTag.innerText = '复制';
    (Array.from(preTags) || []).forEach(item => {
      item.setAttribute("style", "position: relative");
      item.appendChild(divTag);
      hljs.highlightBlock(item)
    });
    const regHead = /^H\d$/;
    let hTags = Array.from(content.children).filter(el => regHead.test(el.nodeName) && el.innerText && el.id);
    hTags =  hTags.map(el => {
      const index = el.nodeName[1];
      return (
        <a href={`#${el.id}`} styleName={`h${index}`} key={el.id} title={el.innerText}>{el.innerText}</a>
      )
    })
    this.setState({
      catalog: hTags,
    });
    Array.from(document.querySelectorAll('.pre-code')).forEach(item => item.addEventListener('click', () => this.copyCode(item.previousSibling)));
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
    const { blogDetail, loading, catalog } = this.state;
    const { permission } = this.props;
    const canOpertion = permission === 'manager';
    return (
        <div styleName="blog-detail">
          {/* <Spin spinning={loading}> */}
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
              <div id="blog-content" styleName="content" dangerouslySetInnerHTML = {{ __html: converter.makeHtml(blogDetail.content) }} />
            </div>
            <div styleName="catalog">
              {catalog}
            </div>
          {/* </Spin> */}
        </div>
    )
  }
}