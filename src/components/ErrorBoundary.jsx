import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="container page" lang="en">
        <h1>We could not display this page</h1>
        <p>
          Please reload the site or contact the organization if the problem
          continues.
        </p>
        <a className="btn btn-primary" href="/">
          Reload home page
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
