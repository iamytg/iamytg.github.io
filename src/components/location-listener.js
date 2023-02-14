import { Component } from 'react';
import PropTypes from 'prop-types';

export default class extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.handleLocationChange(this.context.router.history.location);
    this.unlisten =
this.context.router.history.listen(this.handleLocationChange);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleLocationChange = (location) => {
    // your staff here
    // console.log(`- - - location: '${location.pathname}'`);
    if (this.props.updatePathname) {
      this.props.updatePathname(location.pathname);
    }
  }

  render() {
    return this.props.children;
  }
}
