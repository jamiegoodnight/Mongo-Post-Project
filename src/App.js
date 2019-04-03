import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

const StyledApp = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 960px;
  background-image: url("http://www.ashtonhawks.com/wp-content/uploads/2018/04/space-planets-space-wallpaper-1.jpg");
  nav {
    height: 70px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border: 1px solid black;
    background: black;
    h1 {
      color: white;
      margin: 0;
      text-align: center;
    }
    .pagination {
      width: 100px;
      height: 30px;
    }
  }
  form {
    h2 {
      color: yellow;
      font-size: 16px;
    }
    border: 1px solid gray;
    background: black;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    width: 300px;
    input {
      height: 30px;
    }
    .addButton {
      border-radius: 10px;
      color: white;
      background-color: #00b300;
      width: 100px;
      height: 30px;
      margin: 0 auto;
      transition: 0.2s;

      &:hover {
        background-color: #008000;
        box-shadow: 0px 5px 5px 0px rgba(176, 170, 176, 1);
        transform: translateY(-2px);
        transition: 0.2s;
      }
    
      &:active {
        transform: translateY(2px);
        box-shadow: none;
        transition: 0.2s;
        }
  }
`;

const CentralDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .card-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    .card {
      p {
        color: yellow;
      }
      display: flex;
      flex-direction: column;
      text-align: center;
      background: black;
      margin: 0 auto;
      border: 1px solid gray;
      width: 300px;
      button {
        border-radius: 10px;
        color: white;
        background: indianred;
        width: 100px;
        height: 30px;
        margin: 0 auto;
        transition: 0.2s;
  
        &:hover {
          background-color: red;
          box-shadow: 0px 5px 5px 0px rgba(176, 170, 176, 1);
          transform: translateY(-2px);
          transition: 0.2s;
        }
      
        &:active {
          transform: translateY(2px);
          box-shadow: none;
          transition: 0.2s;
          }
    }
  }
`;

class App extends Component {
  state = {
    title: "",
    description: "",
    results: [],
    curResults: [],
    perPage: 5,
    curPage: 1
  };

  async componentDidMount() {
    try {
      const results = await axios.get("http://localhost:5000/");
      this.setState({
        results: results.data,
        curResults: results.data.slice(0, this.state.perPage)
      });
    } catch (error) {
      console.log(error);
    }
  }

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitHandler = async e => {
    e.preventDefault();
    if (!this.state.title && !this.state.description) {
      alert("Please provide a title and a description");
      //Check if the state for both is not empty.
    } else {
      try {
        //Assign the new post to an object
        const post = {
          title: this.state.title,
          description: this.state.description
        };
        //Get back all the post information to put into state
        const newPost = await axios.post("http://localhost:5000/", post);
        //Add the newPost to the state with the id included
        this.setState(
          {
            title: "",
            description: "",
            results: [...this.state.results, newPost.data]
          },
          this.calcCurResults
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  deleteHandler = async (e, id) => {
    e.preventDefault();
    //Try to remove the item from the database
    try {
      //Get the result so we can see what the status is.
      const result = await axios.delete(`http://localhost:5000/${id}`);
      //If status is ok, then remove the post from the results array.
      if (result.status === 200) {
        this.setState(
          {
            results: this.state.results.filter(post => post._id !== id)
          },
          this.calcCurResults
        );
      }
    } catch (err) {
      //Log out any promise errors
      console.log(err);
    }
  };

  nextPageHandler = () => {
    this.setState(
      {
        curPage: this.state.curPage + 1
      },
      this.calcCurResults
    );
  };

  prevPageHandler = () => {
    this.setState(
      {
        curPage: this.state.curPage - 1
      },
      this.calcCurResults
    );
  };

  calcCurResults = () => {
    const nextResultsEnd = this.state.curPage * this.state.perPage;
    const nextResultsStart = nextResultsEnd - this.state.perPage;
    this.setState({
      curResults: this.state.results.slice(nextResultsStart, nextResultsEnd)
    });
  };

  render() {
    return (
      <StyledApp>
        <nav>
          {this.state.curPage !== 1 ? (
            <button
              className="pagination"
              type="button"
              onClick={this.prevPageHandler}
            >
              ◄◄
            </button>
          ) : (
            <button className="pagination" disabled>
              ◄◄
            </button>
          )}
          <h1>Space Movies</h1>

          {this.state.curPage !== Math.ceil(this.state.results.length / 5) ? (
            <button
              className="pagination"
              type="button"
              onClick={this.nextPageHandler}
            >
              ►►
            </button>
          ) : (
            <button className="pagination" disabled>
              ►►
            </button>
          )}
        </nav>

        <form onSubmit={this.submitHandler}>
          <h2>Title:</h2>
          <input
            type="text"
            placeholder="Enter a title..."
            onChange={this.changeHandler}
            value={this.state.title}
            name="title"
          />
          <h2>Description:</h2>
          <input
            type="text"
            placeholder="Enter a description..."
            onChange={this.changeHandler}
            value={this.state.description}
            name="description"
          />
          <button className="addButton" onClick={this.submitHandler}>
            Add
          </button>
        </form>

        <CentralDiv>
          <div className="card-container">
            {this.state.curResults.map(item => (
              <div className="card" key={item._id}>
                <p>{item.title}</p>
                <p>{item.description}</p>
                <button onClick={e => this.deleteHandler(e, item._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </CentralDiv>
      </StyledApp>
    );
  }
}

export default App;
