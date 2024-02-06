import React, {Component} from 'react';
// here we import in our loader as an image
import loader from './images/loader.svg';
import './css/main.css';

const Header = () => (
  <div className="header grid">
    <h1 className="title">Jiffy</h1>
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {/* here we check wheter we have a loading state and render out
  either our spinner or hintText based on that, using a ternary
  operator */}
    {loading ? <img alt="loader" className="block mx-auto" src={loader} /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      hintText: 'Hit enter to search',
    };
  }

  handleChange = (event) => {
    console.log(event.key);

    const {value} = event.target;
    // by setting the searchTerm in our state and also
    // using that on the input as the value, we have created
    // what is called a controlled input
    this.setState((prevState, props) => ({
      // we take our old props and spread them out here
      ...prevState,
      // and then we overwrite the ones we want after
      searchTerm: value,
      // we set the hint text only when we have more then
      // 2 characters in our input, otherwise it is an empty string
      hintText: value.length >2 ? `Hit enter to search ${value}` : '',
    }));

    if (value.length > 2) {
      console.log('this is a valid search term');
    }
  };

  handleKeyPress = (event) => {
    const {value} = event.target;
    // when we have 2 or more characters in our search box
    // and we have also pressed enter, we then want to run a search
    if (value.length > 2 && event.key === 'Enter') {
      alert(`search for ${value}`);
    }

    console.log(event.key);
  };

  render() {
    const {searchTerm} = this.state;
    return (
      <div className="page">
        <Header />
        <div className="search grid">
          {/* {stack of gif images} */}
          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
          ></input>
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
