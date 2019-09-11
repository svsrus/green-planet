import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Table from "./Table";
const AppReactGreenPlanet = () => (
  <DataProvider endpoint="api/test"
                render={data => <Table data={data} />} />
);
const wrapper = document.getElementById("appGreenPlanet");
wrapper ? ReactDOM.render(<AppReactGreenPlanet />, wrapper) : null;