import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Form, Input, Button, Tag, Modal, message } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import CSSModules from 'react-css-modules';
import request from 'utils/request';
import blogTags from 'constants/blog';
import styles from './index.less';

const { CheckableTag } = Tag;

@Form.create(BlogOperation)
@CSSModules(styles)
export default class BlogOperation extends React.Component {
  state = {
    content: '', // 富文本内容
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
          });
          this.setState({
            content: data.content,
            checkedTag: data.tag,
          })
        }
      })
    }
  }

  // 富文本内容改变
  handleEditorChange = content => {
    this.setState({
      content,
    });
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
    const { checkedTag, content } = this.state;
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
        params.content = content;
        params.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
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
        console.log(this.state.content)
        if (!this.state.content) {
          message.error('请输入文章内容');
          return;
        } else {
          this.toggleDialogVisible();
        }
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dialogVisible, content, checkedTag } = this.state;
    return (
      <div styleName="blog-operation">
        <div styleName="top-des">
          <div styleName="des">编辑文章</div>
          <div>
            <Button onClick={this.back}>返回博客列表</Button>
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
        <Editor
          value={content}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | | preview'
          }}
          onEditorChange={this.handleEditorChange}
          apiKey="spu6lepvjcgzpdnxdi9jj9f36k3lb3a0we7ikzl4rskqdhzs"
        />
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
      </div>
      
    );
  }
}
