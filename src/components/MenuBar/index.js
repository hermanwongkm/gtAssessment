import React from "react";

import Inputs from "./Inputs";
import DrawerToggleButton from "./DrawerToggleButton.js";

import "./MenuBar.css";
//what happens if min > max
//Share the 2 components state?
class UserInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minSalary: 0,
      maxSalary: 0,
      offSet: 0,
      limit: 30,
      sort: "+",
      sortType: "id",
      drawerOpen: false,
    };
  }

  componentDidMount = async () => {
    console.log(this.props);
  };

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { drawerOpen: !prevState.drawerOpen };
    });
  };

  onChangeOrder = (e) => {
    this.setState({
      sort: e.target.value,
    });
  };

  onChangeSortType = (e) => {
    this.setState({
      sortType: e.target.value,
    });
  };

  onChangeMinSalary = (value) => {
    console.log(value);
    this.setState({ minSalary: value });
  };

  onChangeMaxSalary = (value) => {
    console.log(value);
    this.setState({ maxSalary: value });
  };

  onSubmit = () => {
    this.props.search({
      maxSalary: this.state.maxSalary,
      minSalary: this.state.minSalary,
      sort: "" + this.state.sort + this.state.sortType,
    });
  };

  backdropClickHandler = () => {
    this.setState({ drawerOpen: false });
  };

  render() {
    let backdrop;
    if (this.state.drawerOpen) {
      backdrop = (
        <div className="backdrop" onClick={this.backdropClickHandler} />
      );
    }
    return (
      <div>
        <div
          className={this.state.drawerOpen ? "side-drawer open" : "side-drawer"}
        >
          <Inputs
            vertical={true}
            onChangeOrder={this.onChangeOrder}
            onChangeMinSalary={this.onChangeMinSalary}
            onChangeMaxSalary={this.onChangeMaxSalary}
            onChangeSortType={this.onChangeSortType}
            onSubmit={this.onSubmit}
          />
        </div>
        <header className="menuBar">
          <div className="menuBar__toggleButton">
            <DrawerToggleButton click={this.drawerToggleClickHandler} />
          </div>
          <div className="menu__horizontal">
            <Inputs
              onChangeOrder={this.onChangeOrder}
              onChangeMinSalary={this.onChangeMinSalary}
              onChangeMaxSalary={this.onChangeMaxSalary}
              onChangeSortType={this.onChangeSortType}
              onSubmit={this.onSubmit}
            />
          </div>
        </header>
        {backdrop}
      </div>
    );
  }
}

export default UserInput;
