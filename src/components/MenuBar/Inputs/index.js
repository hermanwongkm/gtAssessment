import React from "react";
import { InputNumber, Radio, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "./Inputs.css";

class Inputs extends React.Component {
  componentDidMount = async () => {};

  render() {
    return (
      <div className={this.props.vertical ? "vertical" : "horizontal"}>
        <div className="individual">
          Min Salary:
          <InputNumber
            min={0}
            defaultValue={0}
            onChange={this.props.onChangeMinSalary}
          />
        </div>
        <div className="individual">
          Max Salary:
          <InputNumber
            min={0}
            defaultValue={0}
            onChange={this.props.onChangeMaxSalary}
          />
        </div>
        <div className="individual">
          Sort Type:
          <Radio.Group onChange={this.props.onChangeSortType} defaultValue="id">
            <Radio.Button value="id">id</Radio.Button>
            <Radio.Button value="login">login</Radio.Button>
            <Radio.Button value="name">name</Radio.Button>
            <Radio.Button value="salary">salary</Radio.Button>
          </Radio.Group>
        </div>
        <div className="individual">
          Sort Order:
          <Radio.Group onChange={this.props.onChangeOrder} defaultValue="+">
            <Radio.Button value="+">Asc</Radio.Button>
            <Radio.Button value="-">Des</Radio.Button>
          </Radio.Group>
        </div>
        <div className="individual">
          <Button
            type="primary"
            size="large"
            onClick={this.props.onSubmit}
            icon={<SearchOutlined />}
          >
            Search{" "}
          </Button>
          <Button />
        </div>
      </div>
    );
  }
}

export default Inputs;
