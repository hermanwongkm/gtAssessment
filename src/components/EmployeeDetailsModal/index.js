import React from "react";
import { Modal, Input } from "antd";

class EmployeeDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      login: null,
      name: null,
      salary: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      const { id, name, login, salary } = this.props.data;
      this.setState({
        id,
        login,
        name,
        salary,
      });
    }
  }

  onSubmit = () => {
    if (this.props.create) {
      this.props.onCreate(this.state);
    } else {
      this.props.onEdit(this.state);
    }
    this.props.cancel();
  };

  onIdChange = (e) => {
    this.setState({
      id: e.target.value,
    });
  };

  onNameChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  onloginChange = (e) => {
    this.setState({
      login: e.target.value,
    });
  };

  onSalaryChange = (e) => {
    this.setState({
      salary: e.target.value,
    });
  };

  render() {
    if (this.props.data === null && !this.props.create) {
      return <div></div>;
    }
    return (
      <div>
        <Modal
          title={
            this.props.create
              ? "Add a new employee"
              : "Edit " + this.props.data.id
          }
          visible={this.props.open}
          onOk={this.onSubmit}
          onCancel={this.props.cancel}
        >
          {this.props.create ? (
            <div>
              Id:
              <Input
                placeholder="Id"
                value={this.state.id}
                onChange={this.onIdChange}
              />
            </div>
          ) : (
            ""
          )}
          Login:
          <Input
            placeholder="Login"
            value={this.state.login}
            onChange={this.onloginChange}
          />
          Name:
          <Input
            placeholder="Name"
            value={this.state.name}
            onChange={this.onNameChange}
          />
          Salary:
          <Input
            placeholder="Salary"
            value={this.state.salary}
            onChange={this.onSalaryChange}
          />
        </Modal>
      </div>
    );
  }
}

export default EmployeeDetailsModal;
