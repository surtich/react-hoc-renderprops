import React, { Component } from "react";
import ReactDOM from "react-dom";

const TestComponent = ({ title }) => <div>{title}</div>;

const toHOC = Render => Component => props => (
  <Render {...props}>{props => <Component {...props} />}</Render>
);

const fromHOC = hoc => hoc(props => props.children(props));

const withLoadingHOC = Component => ({ loading, ...props }) =>
  loading ? <div>...loading from HOC</div> : <Component {...props} />;

const WithLoadingRenderProps = ({ loading, children, ...props }) =>
  loading ? <div>...loading from render props</div> : children(props);

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
      return (
        <WrappedComponent loading={loading} title={title} {...this.props} />
      );
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
    const { children, ...props } = this.props;
    return children({ ...props, loading, title });
  }
}

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
  const TestToHOC = toHOC(WithFetchRenderProps)(withLoadingHOC(TestComponent));
  const TestFromHOC = fromHOC(withFetchHOC);
  return (
    <div>
      <TestComponent title="Hi from normal component" />
      <TestHOCComponent />
      {testRenderPropComponent}
      {<TestToHOC />}
      <TestFromHOC>
        {({ loading, title }) => (
          <WithLoadingRenderProps loading={loading}>
            {() => <TestComponent title={title} />}
          </WithLoadingRenderProps>
        )}
      </TestFromHOC>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
