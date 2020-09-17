import React, { Component } from "react";
import Graph from "../graph/Graph";
import makeToast from "../../components/Toaster";
import AddUser from "../AddUser/AddUser";
import EditUser from "../EditUser/EditUser";
import "./User.css";
// import MaterialTable from 'material-table';

class User extends Component {
  state = {
    error: "",
    user: [],
    currentTime: {},
    userId: "",
    graphOpen: false,
    newUserOpen: false,
    editUserOpen: false,
    name: "",
    email: "",
    designation: "",
  };

  componentDidMount() {
    fetch(`https://dashclick.herokuapp.com/admin/getAllUsers`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
          return;
        }
        this.setState({ user: data.user });
      })
      .catch((err) => {
        console.log("Error in Getting all the users", err);
      });
  }

  updateUserHandler = () => {
    fetch(`https://dashclick.herokuapp.com/admin/getAllUsers`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
          return;
        }
        this.setState({ user: data.user });
      })
      .catch((err) => {
        console.log("Error in Getting all the users", err);
      });
  };

  showWorkingHour = (id) => {
    this.setState({ graphOpen: true, newUserOpen: false, editUserOpen: false });
    for (let i = 0; i < this.state.user.length; i++) {
      if (this.state.user[i]._id === id) {
        this.setState({ currentTime: this.state.user[i].workingHours });
        break;
      }
    }
  };

  deleteHandler = (e, id) => {
    console.log(id);
    e.preventDefault();
    fetch(`https://dashclick.herokuapp.com/admin/deleteUser/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (res.error) {
          makeToast("error", "Request Failed");
          return;
        }
        makeToast("success", "Deleted Succesfully !!");
        let user = [...this.state.user];
        user = user.filter((user) => user._id !== id);
        this.setState({ user: user });
      })
      .catch((err) => makeToast("error", "Request Failed"));
  };

  render() {
    var data = this.state.user.map((ele) => {
      return (
        <tr className="list_data" key={ele._id}>
          <th>{ele.name}</th>
          <th>{ele.email}</th>
          <th>{ele.designation}</th>
          <th>
            <button
              type="button"
              class="btn btn-primary"
              data-toggle="modal"
              data-target="#exampleModalLong"
              onClick={() => this.showWorkingHour(ele._id)}
            >
              <i class="fa fa-calendar"></i>
            </button>
          </th>

          <th>
            <i class="fa fa-tasks"></i>
          </th>
          <th>
            {
              <button
                style={{ display: "inline-block", marginRight: "8px" }}
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModalLong"
                onClick={(e) =>
                  this.setState({
                    userId: ele._id,
                    graphOpen: false,
                    newUserOpen: false,
                    editUserOpen: true,
                    email: ele.email,
                    designation: ele.designation,
                    name: ele.name,
                  })
                }
              >
                Edit
              </button>
            }
          </th>
          <th>
            <button
              style={{ display: "inline-block" }}
              className="btn btn-danger"
              onClick={(e) => this.deleteHandler(e, ele["_id"])}
            >
              Delete
            </button>
          </th>
        </tr>
      );
    });

    return (
      <div className="user-lists">
        <div
          class="modal fade"
          id="exampleModalLong"
          // tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLongTitle"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-dialog-centered modal-lg"
            role="document"
          >
            <div class="modal-content">
              <div class="modal-header">
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => this.updateUserHandler()}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {this.state.graphOpen && (
                  <Graph timing={this.state.currentTime} />
                )}
                {this.state.newUserOpen && <AddUser />}
                {this.state.editUserOpen && (
                  <EditUser
                    userId={this.state.userId}
                    email={this.state.email}
                    name={this.state.name}
                    designation={this.state.designation}
                    workingHours={this.state.currentTime}
                  />
                )}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => this.updateUserHandler()}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <button
            className="add_user_button"
            type="button"
            style={{ position: "absolute", right: 50, top: 30 }}
            data-toggle="modal"
            data-target="#exampleModalLong"
            onClick={() =>
              this.setState({
                graphOpen: false,
                editUserOpen: false,
                newUserOpen: true,
              })
            }
          >
            Add User
          </button>
        </div>

        <div
          className="row"
          style={{
            overflow: "auto",
            top: 80,
            position: "absolute",
          }}
        >
          <div className="main_table">
            <table className="table ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th>Working Hours</th>
                  <th style={{ float: "center" }}>Tasks</th>
                  <th style={{ paddingLeft: "30px" }}>Edit</th>
                  <th style={{ paddingLeft: "30px" }}>Delete</th>
                </tr>
              </thead>
              <tbody>{data}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default User;