/**
 * 文章添加页面
 */
import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import showdown from 'showdown';
import moment from 'moment';
import { Form, Input, Button, Tag, Modal, message } from 'antd';
import request from 'utils/request';
import blogTags from 'constants/blog';
import styles from './index.less';

const converter = new showdown.Converter();
const { CheckableTag } = Tag;

@Form.create(BlogOperation)
@CSSModules(styles)
export default class BlogOperation extends Component {
  state = {
    content: '', // 内容
    checkedTag: '', // 选择的标签
    dialogVisible: false, // dialog的显示控制
  }

  componentDidMount() {
    const { operationType } = this.props;
    const { blogId } = this.props.match.params;
    // 处于编辑状态下时赋初始值
    if (operationType === 'edit') {
      request.get(`${QUERYHOST}/getBlogDetail`, { id: blogId }).then(res => {
        if (res && res.success) {
          const data = res.data;
          this.props.form.setFieldsValue({
            title: data.title,
            content: data.content,
          });
          this.setState({
            content: data.content,
            checkedTag: data.tag,
          })
        }
      })
    }
  }

  // 内容的修改
  contentChange = e => {
    this.setState({ content: e.target.value })
  }

  // 控制dialog显示隐藏
  toggleDialogVisible = visible => {
    this.setState({
      dialogVisible: visible,
    })
  }

  // 文章标签的选择
  tagChange = (checked, value) => {
    this.setState({
      checkedTag: value,
    })
  }

  // 取消(回到列表页)
  cancel = () => {
    this.props.history.push('/blog');
  }

  // 接口保存文章
  saveBlog = info => {
    const { operationType } = this.props;
    const requestUrl = operationType === 'add' ? `${QUERYHOST}/addBlog` : `${QUERYHOST}/editBlog`;
    request.post(requestUrl, info).then(res => {
      if (res && res.success) {
        message.success(operationType === 'add' ? '添加成功' : '编辑成功');
        this.cancel();
      }
    })
  }

  // 保存内容
  handleSubmit = () => {
    const { checkedTag } = this.state;
    if (!checkedTag) {
      message.error('请选择标签');
      return false;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { operationType } = this.props;
        const { blogId } = this.props.match.params;
        const params = _.cloneDeep(values);
        params.tag = checkedTag;
        params.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
        if (operationType === 'edit') {
          params.id = blogId;
        }
        this.saveBlog(params);
      }
    });
  }

  render() {
    const { content, checkedTag, dialogVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div styleName="add-blog">
        <div styleName="title">
          {getFieldDecorator('title', {
              rules: [
                { required: true, message: '请填写标题' },
              ],
            })(<Input placeholder="请输入标题" />)}
            <Button
              type="primary"
              style={{ marginLeft: '6px' }}
              onClick={() => this.toggleDialogVisible(true)}
            >
              发布
            </Button>
            <Button onClick={this.cancel} style={{ marginLeft: '6px' }}>取消</Button>
        </div>
        <div styleName="content">
          {getFieldDecorator('content', {
              rules: [
                { required: true, message: '请填写内容' },
              ],
            })(<Input.TextArea style={{ resize: 'none' }} onChange={this.contentChange} />)}
          <div dangerouslySetInnerHTML = {{ __html:converter.makeHtml(content) }} styleName="display-box" />
        </div>
        <Modal
          title="请选择标签"
          visible={dialogVisible}
          onOk={this.handleSubmit}
          onCancel={() => this.toggleDialogVisible(false)}
        >
          {blogTags.map(item => (
            <CheckableTag
              checked={checkedTag === item}
              onChange={checked => this.tagChange(checked, item)}
              key={item}
            >
              {item}
            </CheckableTag>
          ))}
        </Modal>
      </div>
    )
  }
}