import React, { Component } from "react";
import ReactDOM from "react-dom";
import { getConnection, login, logout } from "./connection";
import { Button } from '@salesforce/design-system-react';

const isDEV = process.env.NODE_ENV !== "production";
const PRODUCTION = "https://login.salesforce.com";
const SANDBOX = "https://test.salesforce.com";

class Connect extends Component {
  state = {
    connection: getConnection(),
    username: localStorage.getItem("username") || "",
    password: ""
  };

  componentDidMount() {
    this.renderDevTools();
  }

  componentDidUpdate() {
    this.renderDevTools();
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  authenticate = (e, { value }) => {
    e.preventDefault();

    const { username, password } = this.state;
    if (!value || !username || !password) return;

    this.setState({ isBusy: true, error: null });

    login({ username, password })
      .then(connection =>
        this.setState({ connection, username: "", password: "" })
      )
      .catch(error => this.setState({ error }))
      .then(() => this.setState({ isBusy: false }));
  };

  disconnect = () => {
    const { connection } = this.props;
    logout(connection).then(() => this.setState({ connection: null }));
  };

  renderDevTools() {
    if (!isDEV) return;

    const { connection } = this.state;
    const target = document.getElementById("fx-dev");
    const button = connection
      ? this.renderLogoutButton()
      : this.renderLoginForm();

    target && ReactDOM.render(button, target);
  }

  renderLogoutButton() {
    return (
      <Button
        primary
        size="mini"
        icon="log out"
        content="Dev Logout"
        onClick={this.disconnect}
        style={styles.logout}
      />
    );
  }

  renderLoginForm() {
    const { isBusy, username, password, error } = this.state;

    return (
      <div className="slds-form-element">
        <label className="slds-form-element__label" for="form-element-01">Login Form</label>
        <div className="slds-form-element__control">
          <input type"text" id="form-element" placeholder="username" className="slds-input" />
        </div>
      </div>
    );
  }

  render() {
    const { App } = this.props;
    const { connection } = this.state;
    if (!connection) return null;
    return <App connection={connection} />;
  }
}

const styles = {
  form: {
    background: "#bcbdbd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  segment: { width: 350, margin: "0 auto" },
  logout: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: "10px 12px 8px 10px",
    margin: -3,
    boxShadow: "0 0 0 1px #fff, 0 2px 6px 2px rgba(0,0,0,.5)",
    zIndex: 2
  }
};

export default Connect;
