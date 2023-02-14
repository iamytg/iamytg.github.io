import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from "react-helmet";
import { Card, CardBody, CardImage, CardTitle, CardText } from 'mdbreact';
import StackGrid from 'react-stack-grid';

import Thumbs_D3Bubblechart from '../portfolio/thumbs/D3Bubblechart.png';

import Thumbs_CMS_instructions from '../portfolio/thumbs/CMS-instructions.png';
import Thumbs_MobileLoan_tandc from '../portfolio/thumbs/MobileLoan-tandc.png';
import Thumbs_MobileLoan_landing from '../portfolio/thumbs/MobileLoan_landing.png';
import Thumbs_CMS_luckygames_detail from '../portfolio/thumbs/CMS-luckygames-detail.png';
import Thumbs_CMS_luckygames_list from '../portfolio/thumbs/CMS-luckygames-list.png';
import Thumbs_CMS_gem from '../portfolio/thumbs/CMS-gem.png';
import Thumbs_Dogsitting_issuingCoupons from '../portfolio/thumbs/Dogsitting-issuingCoupons.png';
import Thumbs_Dogsitting_Scores from '../portfolio/thumbs/Dogsitting-Scores.png';
import Thumbs_Concept_factoryDashboard from '../portfolio/thumbs/Concept-factoryDashboard.png';
import Thumbs_Syncclip_bookshelf from '../portfolio/thumbs/Syncclip-bookshelf.png';
import Thumbs_Concept_richShelf from '../portfolio/thumbs/Concept-richShelf.png';
import Thumbs_Website_wizeen from '../portfolio/thumbs/Website-wizeen.png';

const CardContent = ({image, title, text, date}) =>
  [(image === undefined ? null :
    <CardImage className="img-fluid" src={image} />),
  <CardBody>
    <CardTitle>{title}</CardTitle>
    <CardText>{text}<br/><small>{date}</small></CardText>
  </CardBody>];

const CardPanel = ({idx, image, title, text, link, date, isExternal}) =>
  <Card>
    {link.indexOf('http') === 0 ?
    <a href={link} target="_blank">
      <CardContent image={image} title={title} text={text} date={date} />
    </a> :
    <Link to={link}>
      <CardContent image={image} title={title} text={text} date={date} />
    </Link>}
  </Card>;


export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {list: [
      {
        image: Thumbs_D3Bubblechart,
        title: 'd3 Bubble chart 예제',
        link: '/fork/d3-bubblechart',
        date: 'forked at 2018. 4. 5.'
      },
      {
        title: 'React로 GitHub User Pages 만들기',
        link: '/articles/HowtoCreateGithubUserPage',
        date: 'article at 2018. 2. 10.'
      },
      {
        image: Thumbs_CMS_instructions,
        title: 'CMS - 설명 이미지 관리',
        link: '/portfolio/CMS-instructions',
        date: 'work at 2017. 12.'
      },
      {
        image: Thumbs_MobileLoan_tandc,
        title: 'Mobile Loan - T&C',
        link: '/portfolio/MobileLoan-tandc',
        date: 'work at 2017. 11.'
      },
      {
        image: Thumbs_MobileLoan_landing,
        title: 'Mobile Loan - Landing',
        link: '/portfolio/MobileLoan-landing',
        date: 'work at 2017. 10.'
      },
      {
        image: Thumbs_CMS_luckygames_detail,
        title: 'CMS - Lucky game 상세',
        link: '/portfolio/CMS-luckygames-detail',
        date: 'work at 2017. 9.'
      },
      {
        image: Thumbs_CMS_luckygames_list,
        title: 'CMS - Lucky game 목록',
        link: '/portfolio/CMS-luckygames-list',
        date: 'work at 2017. 9.'
      },
      {
        image: Thumbs_CMS_gem,
        title: 'CMS - Point 목록',
        link: '/portfolio/CMS-gem',
        date: 'work at 2017. 8.'
      },
      {
        image: Thumbs_Dogsitting_issuingCoupons,
        title: 'Shop Management - Coupon 발급',
        link: '/portfolio/Dogsitting-issuingCoupons',
        date: 'work at 2017. 3.'
      },
      {
        image: Thumbs_Dogsitting_Scores,
        title: 'Shop Management - 돌보미별 평가',
        link: '/portfolio/Dogsitting-Scores',
        date: 'work at 2016.'
      },
      {
        image: Thumbs_Concept_factoryDashboard,
        title: 'Concept - Factory Operating Dashboard',
        link: 'http://ytglab.cafe24.com/dashboard1.9/',
        date: 'work at 2011. 10.'
      },
      {
        image: Thumbs_Syncclip_bookshelf,
        title: 'Personal Bookshelf & Book review Social Network Service - SyncClip',
        link: 'http://syncclip.com/cachoxm/bookshelf',
        date: 'work at 2011. 8.'
      },
      {
        image: Thumbs_Concept_richShelf,
        title: 'Concept - Rich Personal Shelf',
        link: 'http://ytglab.cafe24.com/prototype/first.html',
        date: 'work at 2011. 4.'
      },
      {
        image: Thumbs_Website_wizeen,
        title: 'Website - 기업 소개 및 홍보',
        link: 'http://wizeen.com',
        date: 'work at 2010.'
      },
    ]};
  }

  render() {
    return ([
      <Helmet key={0}>
        <title>Devlogs</title>
      </Helmet>,
      <StackGrid key={1} columnWidth={250} gutterWidth={30} gutterHeight={15}
        monitorImagesLoaded={true}>
        {this.state.list.map((item, idx) => <CardPanel
          key={idx} image={item.image} title={item.title} text={item.text}
          link={item.link} date={item.date}/>)}
      </StackGrid>
    ]);
  }
}
