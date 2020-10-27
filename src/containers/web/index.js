/**
 * 类目相关的文档展示
 */
import React from 'react';
import CSSModules from 'react-css-modules';
import showdown from 'showdown';
import hljs from 'highlight.js'
import request from 'utils/request';
import styles from './index.less';

const converter = new showdown.Converter();
@CSSModules(styles)
export default class Web extends React.Component {
  state = {
    content: "",
  }

  componentDidMount() {
    this.getContent();
  }

  componentDidUpdate(preProps) {
    if (_.get(preProps, 'match.params.name') !== _.get(this, 'props.match.params.name')) {
      this.getContent();
    }
  }

  componentWillUnMount() {
    Array.from(document.querySelectorAll('pre-code')).removeEventListener('click', this.copyCode);
  }

  getContent = () => {
    const classification = _.get(this.props, 'match.params.classification');
    const name = _.get(this.props, 'match.params.name');
    request.get(`${QUERYHOST}/getWeb`, { classification, name }).then(res => {
      if (res && res.success) {
        this.setState({
          content: res.data,
        }, () => this.hightLight());
      }
    })
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
    const preTags = document.getElementById('category-md').getElementsByTagName('pre');
    var divTag = document.createElement("div");
    divTag.setAttribute("class", "pre-code");
    divTag.innerText = '复制';
    (Array.from(preTags) || []).forEach(item => {
      item.setAttribute("style", "position: relative");
      item.appendChild(divTag);
      hljs.highlightBlock(item)
    });
    Array.from(document.querySelectorAll('.pre-code')).forEach(item => item.addEventListener('click', () => this.copyCode(item.previousSibling)));
  }

  render() {
    const { content } = this.state;
    return (
      <div id="category-md" styleName="blog-detail" dangerouslySetInnerHTML = {{ __html: converter.makeHtml(content) }} />
    )
  }
}  