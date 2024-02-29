import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { RouterProvider } from "./contexts/router_provider";
import UserProvider from "./contexts/user_provider";

import Startup from "./components/route_landings/startup";

import Host from "./components/route_landings/host";
import Board from "./components/route_landings/board";

function Router() {
  return (
    <RouterProvider>
      <UserProvider>
        <BrowserRouter>
          <Switch>
            <Route path={["/host/:host_id/board/:board_id"]}>
              <Host />
            </Route>
            <Route path={["/board/:board_id"]}>
              <Board />
            </Route>
            <Route path="/">
              <Startup />
            </Route>
          </Switch>
        </BrowserRouter>
      </UserProvider>
    </RouterProvider>
  );
}

export default Router;
