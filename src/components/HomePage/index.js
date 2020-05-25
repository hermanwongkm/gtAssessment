import React from "react";
import { Table, Space } from "antd";

import { Button } from "antd";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import "./HomePageStyle.css";

import { getAllEmployees } from "../../api/query";
import MenuBar from "../MenuBar";
import "antd/dist/antd.css";

const { Column } = Table;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      params: null,
      dataToShow: [],
    };
  }
  onSearch = async (params) => {
    this.setState({
      params: params,
    });
    params.offset = 0;
    params.limit = "30"; //Remove magic number
    const res = await getAllEmployees(params);
    this.setState({
      data: res.data.results,
      dataToShow: res.data.results,
      offset: 0,
    });
  };

  onNext = async () => {
    window.scrollTo(0, 0);
    let params = this.state.params;
    params.offset = this.state.offset + 30;
    const res = await getAllEmployees(params);
    console.log(res.data.results);
    this.setState((prevState) => ({
      offset: prevState.offset + 30,
      data: prevState.data.concat(res.data.results),
      dataToShow: res.data.results,
    }));
  };

  onBack = () => {
    window.scrollTo(0, 0);
    this.setState((prevState) => ({
      dataToShow: prevState.data.slice(prevState.offset - 30, prevState.offset),
      offset: prevState.offset - 30,
    }));
  };

  render() {
    return (
      <div className="container">
        <MenuBar search={this.onSearch} />
        <Table dataSource={this.state.dataToShow} pagination={false}>
          <Column title="Id" dataIndex="id" key="name" />
          <Column title="Name" dataIndex="name" key="login" />
          <Column title="Login" dataIndex="login" key="age" />
          <Column title="Salary" dataIndex="salary" key="id" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <a>Edit {record.login}</a>
                <a>Delete</a>
              </Space>
            )}
          />
        </Table>
        <div>
          <Button
            type="primary"
            shape="circle"
            onClick={this.onBack}
            disabled={this.state.offset < 30}
            icon={<CaretLeftOutlined />}
          />
          <Button
            type="primary"
            shape="circle"
            onClick={this.onNext}
            disabled={this.state.dataToShow.length < 30 ? true : false}
            icon={<CaretRightOutlined />}
          />
        </div>
      </div>
    );
  }
}

export default HomePage;
