import jsforce from "jsforce";

const isProduction = process.env.NODE_ENV === "production";
const proxyUrl = "http://localhost:3030";

class Connection extends jsforce.Connection {
  json = url => {
    return this.fetch(url).then(response => response.json());
  };

  fetch = (url, options = {}) => {
    return isProduction
      ? fetch(url, {
          ...options,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })
      : fetch(this.instanceUrl + url, {
          ...options,
          headers: {
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${this.accessToken}`
          }
        });
  };
}

export function getConnection() {
  if (isProduction) {
    const { accessToken, userId, organizationId } = window.FX.SALESFORCE;
    const connection = new Connection({ accessToken });
    const userInfo = {
      id: userId,
      organizationId
    };

    connection.userInfo = userInfo;
    return connection;
  } else {
    const loginUrl = localStorage.getItem("loginUrl");
    const accessToken = localStorage.getItem("accessToken");
    const instanceUrl = localStorage.getItem("instanceUrl");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!loginUrl || !accessToken || !instanceUrl || !userInfo) return;

    const connection = new Connection({
      proxyUrl,
      loginUrl,
      instanceUrl,
      accessToken
    });

    connection.userInfo = userInfo;
    return connection;
  }
}

export function login({ loginUrl, username, password }) {
  const connection = new Connection({ loginUrl, proxyUrl });

  return connection.login(username, password).then(({ id, organizationId }) => {
    const { loginUrl, accessToken, instanceUrl } = connection;
    const userInfo = { id, organizationId };

    localStorage.setItem("loginUrl", loginUrl);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("instanceUrl", instanceUrl);
    localStorage.setItem("username", username);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    connection.userInfo = userInfo;
    return connection;
  });
}

export function logout(connection) {
  localStorage.clear();
  return Promise.resolve(connection && connection.logout());
}
