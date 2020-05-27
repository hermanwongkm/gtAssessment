import React from "react";
import { InputNumber, Select, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "./Inputs.css";

const { Option } = Select;

class Inputs extends React.Component {
  render() {
    return (
      <div className={this.props.vertical ? "vertical" : "horizontal"}>
        <div
          className={
            this.props.vertical ? "vertical__item" : "hortizontal__item"
          }
        >
          <label>Min Salary:</label>
          <InputNumber
            min={0}
            defaultValue={0}
            style={{ width: "8rem" }}
            onChange={this.props.onChangeMinSalary}
          />
        </div>
        <div
          className={
            this.props.vertical ? "vertical__item" : "hortizontal__item"
          }
        >
          <label>Max Salary:</label>
          <InputNumber
            min={0}
            defaultValue={0}
            style={{ width: "8rem" }}
            onChange={this.props.onChangeMaxSalary}
          />
        </div>
        <div
          className={
            this.props.vertical ? "vertical__item" : "hortizontal__item"
          }
        >
          <label>Sort Type:</label>
          <Select
            defaultValue="id"
            style={{ width: "8rem" }}
            onChange={this.props.onChangeSortType}
          >
            <Option value="id">id</Option>
            <Option value="login">login</Option>
            <Option value="name">name</Option>
            <Option value="salary">salary</Option>
          </Select>
        </div>
        <div
          className={
            this.props.vertical ? "vertical__item" : "hortizontal__item"
          }
        >
          <label>Sort Order:</label>
          <Select
            defaultValue="+"
            style={{ width: "8rem" }}
            onChange={this.props.onChangeOrder}
          >
            <Option value="+">Ascending</Option>
            <Option value="-">Descending</Option>
          </Select>
        </div>
        <div className="buttonContainer">
          <Button
            className="button"
            type="primary"
            size="medium"
            onClick={this.props.onSubmit}
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </div>
      </div>
    );
  }
}

export default Inputs;
