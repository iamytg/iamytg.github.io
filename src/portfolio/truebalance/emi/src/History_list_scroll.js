// import 'babel-polyfill';
import React, {Component} from 'react';
import Sticky from 'react-sticky-el';
import MotionScroll from 'react-motion-scroll';

import img_phone from '../images/ic-wallet-number.svg';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {data: [], scrollTopTarget: 0};
  }

  componentDidMount() {
    this.arr = [];
    for (let i = 0; i < 50; ) {
      this.arr.push({id: ++i});
    }

    this.setState({data: this.arr}, () => {
      this.updateProps(this.props);
    });

    window.scrollByTb = this.scroll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.updateProps(nextProps);
    }
  }

  updateProps(props) {
    this.scroll(props.match.params.id);
  }

  scroll(id) {
    let scrollTopTarget = 0;
    const scrollId = `item-${id}`;
    try {
      const el = document.getElementById(scrollId);
      scrollTopTarget = el.offsetParent.offsetTop + el.offsetTop - 80;
      // console.log(el.offsetParent, `scrollTopTarget: ${scrollTopTarget}`);
    } catch (e) {
      console.error(e);
    }
    this.setState({scrollTopTarget: scrollTopTarget});
  }

  render() {
    return (
      <MotionScroll height="100vh" className="scroll-area">
        <Content list={this.state.data}
          scrollTopTarget={this.state.scrollTopTarget}/>
      </MotionScroll>
    );
  }
}

class Content extends Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.scrollTopTarget !== nextProps.scrollTopTarget) {
      this.props.scrollTo(nextProps.scrollTopTarget)();
    }
  }

  render() {
    return (
      this.props.list.map((item, i) =>
      <div id={`block-${i}`} style={{position: 'relative'}}>
        <Sticky boundaryElement={`#block-${i}`} scrollElement=".scroll-area"
          hideOnBoundaryHit={false}>
          <div style={{height: 80}}>
            <h2 style={{ lineHeight: '80px', padding: '0 15px', margin: 0 }}>
              <span className="pull-left">&lt;Header #{item.id} /&gt;</span>
            </h2>
          </div>
        </Sticky>
        <ul className="list-unstyled history-section">
          <li className="well" key={i*10+1} id={`item-${item.id}-1`}>{item.id}-1</li>
          <li className="well" key={i*10+2} id={`item-${item.id}-2`}>{item.id}-2</li>
        </ul>
      </div>
      )
    );
  }
}
