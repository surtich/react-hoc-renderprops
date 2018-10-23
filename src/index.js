import React, { Component } from "react";
import ReactDOM from "react-dom";

const TestComponent = ({ title }) => <div>{title}</div>;

const withLoadingHOC = Component => ({ loading, ...props }) =>
  loading ? <div>...loading from HOC</div> : <Component {...props} />;

const withFetchHOC = WrappedComponent =>
  class WithFetchHOC extends Component {
    state = {
      loading: true,
      data: {}
    };
    componentDidMount() {
      setTimeout(() => {
        this.setState({
          loading: false,
          data: {
            title: "Hi from HOC"
          }
        });
      }, 2000);
    }
    render() {
      const {
        loading,
        data: { title }
      } = this.state;
      return <WrappedComponent loading={loading} title={title} />;
    }
  };

class WithFetchRenderProps extends Component {
  state = {
    loading: true,
    data: {}
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false,
        data: {
          title: "Hi from render props"
        }
      });
    }, 2000);
  }
  render() {
    const {
      loading,
      data: { title }
    } = this.state;
    const { children } = this.props;
    return children({ loading, title });
  }
}

const WithLoadingRenderProps = ({ loading, children }) =>
  loading ? <div>...loading from render props</div> : children();

const App = () => {
  const TestHOCComponent = withFetchHOC(withLoadingHOC(TestComponent));
  const testRenderPropComponent = (
    <WithFetchRenderProps>
      {({ loading, title }) => (
        <WithLoadingRenderProps loading={loading}>
          {() => <TestComponent title={title} />}
        </WithLoadingRenderProps>
      )}
    </WithFetchRenderProps>
  );
  return (
    <div>
      <TestComponent title="Hi from normal component" />
      <TestHOCComponent />
      {testRenderPropComponent}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
