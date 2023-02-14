import React, { Component } from 'react';
import {Helmet} from "react-helmet";
// import {Button}
//   from 'React-Bootstrap-with-Material-Design';//'mdbreact';
import ReactMarkdown from 'react-markdown';

import CodeBlock from '../components/code-block';

const content = `
# React로 GitHub User Pages 만들기

사전 준비

* GitHub 가입 및 repository \`{username}.github.io\` 생성
* 로컬시스템에 어울리는 node 및 npm, git 설치

---

## React 시작

> 프로젝트 공식 사이트: [create-react-app](//github.com/facebook/create-react-app)

> 위 사이트 내 GitHub 배포 관련 설명:
[Deployment - GitHub Pages](//github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages)


\`\`\`shell
$ npx create-react-app github-user-page

$ cd github-user-page
$ npm start
\`\`\`

---

## GitHub 적용
> GitHub Pages의 종류 설명:
[GitHub Help](//help.github.com/articles/user-organization-and-project-pages)

1. 설정 (최초 1회)
    \`\`\`shell
    $ git init
    Initialized empty Git repository in /your-directory/github-user-page/.git/
    $ git config remote.origin.url https://github.com/{username}/{username}.github.io.git
    $ npm i gh-pages --save-dev

    $ npm i

    \`\`\`

    \`\`\`package.json
    {
      "name": "github-user-page",
      "version": "0.1.0",
    + "homepage": "https://{username}.github.io",

      "scripts": {
    +   "predeploy": "npm run build",
    +   "deploy": "gh-pages -b master -d build"
    \`\`\`

2. 적용

    \`\`\`shell
    $ npm run deploy

    Published
    \`\`\`

`;

// style 별도로 바꾸려면 아래처럼 축약식으로 사용
// const CodeBlock = ({language, value, style}) =>
//   <SyntaxHighlighter language={language}
//     style={tomorrowNight}>{value}</SyntaxHighlighter>;
const Link = ({href, children}) =>
  <a href={href} target="_blank">{children}</a>;

export default class extends Component {
  render() {
    return (
      <article>
        <Helmet>
          <title>React로 GitHub User Pages 만들기</title>
        </Helmet>
        <ReactMarkdown mode="raw" source={content}
          skipHtml={false} escapeHtml={false}
          renderers={{code: CodeBlock, link: Link}} />
      </article>
    );
  }
}
