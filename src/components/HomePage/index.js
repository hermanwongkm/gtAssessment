import React from "react";
import { Table, Space, Popconfirm, Input } from "antd";

import { Button } from "antd";
import {
  CaretRightOutlined,
  CaretLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EmployeeDetailsModal from "../EmployeeDetailsModal";
import "./HomePageStyle.css";

import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  createEmployee,
  deleteEmployeeById,
} from "../../api/query";
import MenuBar from "../MenuBar";
import "antd/dist/antd.css";

const { Column } = Table;
const { Search } = Input;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      params: null,
      dataToShow: [],
      openEditModal: false,
      openCreateModal: false,
      employeeToEdit: null,
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

  onEmployeeIdSearch = async (id) => {
    const res = await getEmployeeById(id);
    console.log(res);
    this.setState({
      data: [res.data],
      dataToShow: [res.data],
      offset: 0,
    });
  };

  onNext = async () => {
    window.scrollTo(0, 0);
    let params = this.state.params;
    params.offset = this.state.offset + 30;
    const res = await getAllEmployees(params);
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

  edit = (record) => {
    this.setState({
      employeeToEdit: record,
    });
    this.showModal();
  };

  delete = async (employee) => {
    let array = this.state.data;
    const newArray = array.filter((e) => e.id !== employee.id);
    this.setState({
      data: newArray,
      dataToShow: newArray.slice(this.state.offset, this.state.offset + 30),
    });
    await deleteEmployeeById(employee.id);
  };

  confirm = () => {
    console.log("confirm");
  };
  cancel = () => {
    console.log("confirm");
  };

  showModal = () => {
    this.setState({
      openEditModal: true,
    });
  };

  hideModal = () => {
    this.setState({
      openEditModal: false,
      openCreateModal: false,
    });
  };

  onEdit = async (employee) => {
    const updatedEmployee = await updateEmployee(employee.id, employee);
    let index = this.state.data.findIndex((e) => e.id === employee.id);
    let array = this.state.data;
    array[index] = updatedEmployee.data;
    this.setState({
      data: array,
      dataToShow: array.slice(this.state.offset, this.state.offset + 30),
    });
  };

  onCreate = async (employee) => {
    console.log(employee);
    const updatedEmployee = await createEmployee(employee.id, employee);
  };

  handleAdd = () => {
    this.setState({
      openCreateModal: true,
    });
  };

  render() {
    return (
      <div className="container">
        <MenuBar search={this.onSearch} />
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{ marginTop: 16, marginBottom: 16, marginLeft: 5 }}
        >
          Add a row
        </Button>
        <Search
          placeholder="input employee Id"
          onSearch={(value) => this.onEmployeeIdSearch(value)}
          style={{ width: 200, margin: 10 }}
        />
        <EmployeeDetailsModal
          open={this.state.openCreateModal}
          cancel={this.hideModal}
          onCreate={this.onCreate}
          create={true}
        ></EmployeeDetailsModal>
        <Table dataSource={this.state.dataToShow} pagination={false}>
          <Column title="Id" dataIndex="id" key="id" />
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Login" dataIndex="login" key="login" />
          <Column title="Salary" dataIndex="salary" key="salary" />
          <Column
            title="Action"
            key="action"
            render={(text, record) => {
              return (
                <Space size="middle">
                  <EditOutlined onClick={() => this.edit(record)} />
                  <Popconfirm
                    title="Are you sure delete this task?"
                    onConfirm={() => this.delete(record)}
                    onCancel={this.cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </Space>
              );
            }}
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
        <EmployeeDetailsModal
          open={this.state.openEditModal}
          cancel={this.hideModal}
          data={this.state.employeeToEdit}
          onEdit={this.onEdit}
        ></EmployeeDetailsModal>
      </div>
    );
  }
}

export default HomePage;
