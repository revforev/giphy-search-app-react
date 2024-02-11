import React, {Component} from 'react';
// here we import in our loader as an image
import loader from './images/loader.svg';
import './css/main.css';
import Gif from './gif';
import clearButton from './images/close-icon.svg';

const randomChoice = (arr) => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
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
    // this.textInput = React.createRef();
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gifs: [],
    };
  }

  // we want a function that searches the giphy api
  // using fetch and pus the search term into the query
  // url and then we can do something with the results

  // we can also write async methods into our components
  // that let us use the async/await style of function

  searchGiphy = async (searchTerm) => {
    this.setState({
      // we first set the loading state to be true
      loading: true,
    });
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=YLaXcGQpJq0zBZcIINCx3INyMdrdAgcb&q=${searchTerm}&limit=25&offset=0&rating=r&lang=en&bundle=messaging_non_clips`
      );

      // here we convert our raw response into json data
      // const {data} gets the .data part of our repsponse
      const {data} = await response.json();

      // here we check if the area of the results is empty
      // if it is, we throw an error which will stop the code
      // here while we catch it and handle it

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }

      // here we grab a random result from our images
      const randomGif = randomChoice(data);

      console.log({randomGif});

      this.setState((prevState, props) => ({
        ...prevState,
        // get the first result and put it in the state
        gif: randomGif,
        // here we use our spread to take the previous gifs
        // spread them out and then add a new gif onto the end
        gifs: [...prevState.gifs, randomGif],
        // we turn off our loading spinner again
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`,
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false,
      }));
      console.log(error);
    }
  };

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
      hintText: value.length > 2 ? `Hit enter to search ${value}` : '',
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
      // here we call our searchGiphy function using the search term
      this.searchGiphy(value);
    }

    console.log(event.key);
  };

  // here we reset our state by clearing everything up
  // and making it default again

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: [],
    }));
    this.textInput.focus();
  };

  render() {
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {/* {stack of gif images} */}
          {/* it's only going to render our video when we have a gif
          // in the state, we can test for it using && */}

          {this.state.gifs.map((gif) => (
            <Gif {...gif} />
          ))}

          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={(input) => {
              this.textInput = input;
            }}
          ></input>
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
