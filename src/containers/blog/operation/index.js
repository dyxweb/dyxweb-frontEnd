import React from 'react';
import lodashCloneDeep from 'lodash.clonedeep';
import hljs from 'highlight.js'
import showdown from 'showdown';
import { Form, Input, Button, Tag, Modal, message } from 'antd';
import CSSModules from 'react-css-modules';
import request from 'utils/request';
import blogTags from 'constants/blog';
import styles from './index.less';

const { CheckableTag } = Tag;
const converter = new showdown.Converter();

@Form.create(BlogOperation)
@CSSModules(styles)
export default class BlogOperation extends React.Component {
  state = {
    checkedTag: '', // 选择的标签
    dialogVisible: false, // 标签dialog的显示控制
    previewVisible: false, // 预览dialog的显示控制
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
            checkedTag: data.tags,
          })
        }
      })
    }
  }

  // 文章标签的选择
  tagChange = (checked, value) => {
    this.setState({
      checkedTag: value,
    })
  }

  // 接口保存文章
  saveBlog = info => {
    const { operationType } = this.props;
    const requestUrl = operationType === 'add' ? `${QUERYHOST}/addBlog` : `${QUERYHOST}/editBlog`;
    request.post(requestUrl, info).then(res => {
      if (res && res.success) {
        message.success(operationType === 'add' ? '添加成功' : '编辑成功');
        this.back();
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
        const params = lodashCloneDeep(values);
        params.tags = checkedTag;
        if (operationType === 'edit') {
          params.id = blogId;
        }
        this.saveBlog(params);
      }
    });
  }

  // 点击保存按钮
  onSave = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.toggleDialogVisible();
      }
    })
  }

  // 控制选择文章标签的Dialog显示隐藏
  toggleDialogVisible = () => {
    const { dialogVisible } = this.state;
    this.setState({
      dialogVisible: !dialogVisible,
    })
  }

  // 回到列表页
  back = () => {
    this.props.history.push('/blog');
  }

  // 控制预览的Dialog显示隐藏
  togglePreviewVisible = () => {
    const { previewVisible } = this.state;
    this.setState({
      previewVisible: !previewVisible,
    })
  }

  // 预览
  preview = () => {
    this.setState({
      previewVisible: true,
    }, () => {
      if (document.getElementById('preview-content')) {
        const preTags = document.getElementById('preview-content').getElementsByTagName('pre');
        (Array.from(preTags) || []).forEach(item => hljs.highlightBlock(item));
      } else {
        this.preview();
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { dialogVisible, checkedTag, previewVisible } = this.state;
    return (
      <div styleName="blog-operation">
        <div styleName="top-des">
          <div styleName="des">编辑文章</div>
          <div>
            <Button onClick={this.back}>返回博客列表</Button>
            <Button onClick={this.preview} style={{ marginLeft: '12px' }}>预览</Button>
            <Button type="primary" style={{ marginLeft: '12px' }} onClick={this.onSave}>保存</Button>
          </div>
        </div>
        <div styleName="title">
          {getFieldDecorator('title', {
            rules: [
              { required: true, message: '请输入文章标题' },
            ],
          })(<Input placeholder="请输入标题" />)}
        </div>
        {getFieldDecorator('content', {
            rules: [
              { required: true, message: '请输入文章内容' },
            ],
          })(<Input.TextArea
            placeholder="请输入文章内容"
            autoSize={{ minRows: 24, maxRows: 24 }}
          />)
        }
        <Modal
          title="请选择文章标签"
          visible={dialogVisible}
          onOk={this.handleSubmit}
          onCancel={this.toggleDialogVisible}
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
        <Modal
          title="预览"
          visible={previewVisible}
          onCancel={this.togglePreviewVisible}
          footer={<Button type="primary" onClick={this.togglePreviewVisible}>关闭</Button>}
        >
          <div styleName="preview">
            <div styleName="title">{getFieldValue('title')}</div>
            <div id="preview-content" styleName="content" dangerouslySetInnerHTML = {{ __html:converter.makeHtml(getFieldValue('content')) }} />
          </div>
        </Modal>
      </div>
      
    );
  }
}
