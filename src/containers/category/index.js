/**
 * 类目相关的文档展示
 */
import React from 'react';
import CSSModules from 'react-css-modules';
import { Message } from 'antd';
import hljs from 'highlight.js'
import lodashGet from 'lodash.get';
import showdown from 'showdown';
import mdData from 'md/category/index.js';
import styles from './index.less';

const converter = new showdown.Converter();
@CSSModules(styles)
export default class CategoryFunc extends React.Component {
  componentDidMount() {
    this.hightLight();
  }

  componentDidUpdate() {
    this.hightLight();
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
    const mdKey = lodashGet(this.props, 'match.params.funcname') || 'generateTree';
    const matchMd = lodashGet(mdData, [mdKey]); // 匹配的markdown数据
    return (
      <div styleName="category-md" dangerouslySetInnerHTML={{ __html: converter.makeHtml(matchMd) }} id="category-md" />
    )
  }
}  