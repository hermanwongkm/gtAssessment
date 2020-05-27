import React from "react";
import { Table, Space, Popconfirm, Input, message } from "antd";
import { Button } from "antd";
import {
  CaretRightOutlined,
  CaretLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import EmployeeDetailsModal from "../EmployeeDetailsModal";
import MenuBar from "../MenuBar";
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  createEmployee,
  deleteEmployeeById,
} from "../../api/query";

import "./HomePage.css";
import "antd/dist/antd.css";

const { Column } = Table;
const { Search } = Input;
const LIMIT = 30;
const BADREQUEST = 400;

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
      employeeCount: 0,
    };
  }

  showCreateModal = () => {
    this.setState({
      openCreateModal: true,
    });
  };

  showEditModal = () => {
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

  onSearch = async (params) => {
    this.setState({
      params: params,
    });
    params.offset = 0;
    params.limit = LIMIT;
    const res = await getAllEmployees(params);
    if (res.status === BADREQUEST) {
      message.error("In correct parameters");
    } else {
      this.setState({
        data: res,
        dataToShow: res,
        employeeCount: res.length,
        offset: 0,
      });
    }
  };

  onEmployeeIdSearch = async (id) => {
    const res = await getEmployeeById(id);
    if (res.status === BADREQUEST) {
      message.error(`Employee id:${id} does not exist.`);
    } else {
      this.setState({
        data: [res],
        dataToShow: [res],
        offset: 0,
      });
    }
  };

  onNext = async () => {
    if (this.state.params !== null) {
      window.scrollTo(0, 0);
      let params = this.state.params;
      params.offset = this.state.offset + LIMIT;
      if (params.offset >= this.state.data.length) {
        const res = await getAllEmployees(params);
        this.setState((prevState) => ({
          offset: prevState.offset + LIMIT,
          data: prevState.data.concat(res),
          dataToShow: res,
          employeeCount: res.length,
        }));
      } else {
        this.setState((prevState) => ({
          offset: prevState.offset + LIMIT,
          dataToShow: prevState.data.slice(
            this.state.offset + LIMIT,
            this.state.offset + LIMIT * 2
          ),
          employeeCount: prevState.data.slice(
            this.state.offset + LIMIT,
            this.state.offset + LIMIT * 2
          ).length,
        }));
      }
    }
  };

  onBack = () => {
    window.scrollTo(0, 0);
    this.setState((prevState) => ({
      dataToShow: prevState.data.slice(
        prevState.offset - LIMIT,
        prevState.offset
      ),
      offset: prevState.offset - LIMIT,
      employeeCount: LIMIT,
    }));
  };

  handleEdit = (record) => {
    this.setState({
      employeeToEdit: record,
    });
    this.showEditModal();
  };

  handleDelete = async (employee) => {
    const res = await deleteEmployeeById(employee.id);
    if (res.status === BADREQUEST) {
      message.error("Unable to delete employee");
    } else {
      let array = this.state.data;
      const updatedEmployee = array.filter((e) => e.id !== employee.id);
      this.setState({
        data: updatedEmployee,
        dataToShow: updatedEmployee.slice(
          this.state.offset,
          this.state.offset + LIMIT
        ),
      });
    }
  };

  onEdit = async (employee) => {
    const res = await updateEmployee(employee.id, employee);
    if (res.status === BADREQUEST) {
      message.error(`Incorrect parameters, employee not updated`);
    } else {
      let index = this.state.data.findIndex((e) => e.id === employee.id);
      let array = this.state.data;
      array[index] = res;
      this.setState({
        data: array,
        dataToShow: array.slice(this.state.offset, this.state.offset + LIMIT),
      });
    }
  };

  onCreate = async (employee) => {
    const res = await createEmployee(employee.id, employee);
    if (res.status === BADREQUEST) {
      message.error(`Employee exist or incorrect inputs`);
    } else {
      message.success(`Employee added`);
      this.setState({
        data: [res],
        dataToShow: [res],
        offset: 0,
      });
    }
  };

  render() {
    return (
      <div className="homePage__container">
        <MenuBar search={this.onSearch} />
        <div>
          <Button
            onClick={this.showCreateModal}
            type="primary"
            style={{ marginTop: 16, marginBottom: 16, marginLeft: 5 }}
          >
            Add new employee
          </Button>
          <Search
            placeholder="input employee Id"
            onSearch={(value) => this.onEmployeeIdSearch(value)}
            style={{ width: 200, margin: 10 }}
          />
        </div>
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
                  <EditOutlined onClick={() => this.handleEdit(record)} />
                  <Popconfirm
                    title="Are you sure delete this task?"
                    onConfirm={() => this.handleDelete(record)}
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
        <div className="homePage__scrollButtonContainer">
          <Button
            className="homePage__scrollButton"
            type="primary"
            shape="square"
            onClick={this.onBack}
            disabled={this.state.offset < LIMIT}
            icon={<CaretLeftOutlined />}
          />
          <Button
            className="homePage__scrollButton"
            type="primary"
            shape="square"
            onClick={this.onNext}
            disabled={this.state.employeeCount < LIMIT ? true : false}
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
