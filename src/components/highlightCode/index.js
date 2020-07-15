import React, { Component } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { cop } from 'react-syntax-highlighter/dist/esm/styles/prism';
import _ from 'lodash';
import { Icon, Message } from 'antd';
import './index.less';

export default class HighLightCode extends Component {
  // 复制
  copyCode = code => {
    if (_.get(navigator, 'clipboard.writeText')) {
      navigator.clipboard.writeText(code).then(() => {
        Message.success("复制成功");
      },  (err) => {
        Message.error("复制失败");
      });
    }
  };

  render() {
    const { value, language = 'javascript' } = this.props;
    if (value) {
      return (
        <SyntaxHighlighter
          showLineNumbers={true}
          startingLineNumber={1}
          language={language} 
          style={cop}
          PreTag={({ style, children }) => (
            <div className="code-container">
              <div className="copy-icon">
                <span className="copy" onClick={() => this.copyCode(value)}>
                  <Icon type="copy" />复制
                </span>
              </div>
              <pre style={style}>{children}</pre>
            </div>
          )}
        >
          {value}
        </SyntaxHighlighter>
      )
    } else {
      return null;
    }
  }
}
