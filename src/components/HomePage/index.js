import React from "react";
import { Table, Space } from "antd";
import { stringify } from "query-string";
import "./HomePageStyle.css";

import { getAllEmployees } from "../../api/query";
import MenuBar from "../MenuBar";
import "antd/dist/antd.css";

const { Column } = Table;

const data = [
  {
    key: "1",
    firstName: "John",
    lastName: "Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    firstName: "Jim",
    lastName: "Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    firstName: "Joe",
    lastName: "Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

class HomePage extends React.Component {
  onSearch = async (params) => {
    console.log(stringify(params));
    const res = await getAllEmployees(params);
    console.log(res);
  };

  render() {
    return (
      <div className="container">
        <MenuBar search={this.onSearch} />
        <Table dataSource={data}>
          <Column title="Id" dataIndex="firstName" key="firstName" />
          <Column title="Name" dataIndex="lastName" key="lastName" />
          <Column title="Login" dataIndex="age" key="age" />
          <Column title="Salary" dataIndex="address" key="address" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <a>Edit {record.lastName}</a>
                <a>Delete</a>
              </Space>
            )}
          />
        </Table>
        ,
      </div>
    );
  }
}

export default HomePage;
