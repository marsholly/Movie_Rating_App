let App = React.createClass({
  getInitialState() {
    return {
      movies: []
    }
  },

  componentDidMount() {
    let movieStore = this.movieStorage();
    let newMovieList = movieStore.sort((cur, next) => {
      return (next.score - cur.score);
    });
    this.setState({ movies: newMovieList });
  },

  addMovie(newMovie) {
    let { movies } = this.state;
    this.setState({
      movies: [...movies, newMovie]
    });

    let movieStore = this.movieStorage();
    movieStore.push(newMovie);
    this.writeToStorage(movieStore);
  },

  movieStorage() {
    let json = localStorage.movieStore;
    let movieStore;
    try {
      movieStore = JSON.parse(json);
    } catch(e) {
      movieStore = [];
    }
    return movieStore;
  },

  writeToStorage(movieStore) {
    localStorage.movieStore = JSON.stringify(movieStore);
  },

  getScore(newScore) {
    let json = localStorage.movieStore;
    let movieStore = JSON.parse(json);
    let index = movieStore.findIndex(movie => {
      return movie.createAt === newScore.createAt;
    });
    let updateMovie = movieStore[index];
    updateMovie.score = newScore.score;

    localStorage.movieStore = JSON.stringify(movieStore);
    this.setState({
      movies: movieStore
    })
  },

  sortByScore(){
    let json = localStorage.movieStore;
    let movieStore = JSON.parse(json);
    let newMovieList = movieStore.sort((cur, next) => {
      return (next.score - cur.score);
    });
    this.writeToStorage(newMovieList);
    this.setState({
      movies: newMovieList
    })
    return newMovieList;
  },

  render() {
    return (
      <div className="container">
        <div className="row">
          <MovieForm addMovie={this.addMovie}/>
        </div>
        <br/>
        <div className="row">
          <MovieList movies={this.state.movies} getScore={this.getScore} sortByScore={this.sortByScore}/>
        </div>
      </div>
    )
  }
});

const MovieList = React.createClass({

  upVote(id, number) {
    let newNumber = number+1;
    let newScore = {
      createAt: id,
      score: newNumber
    }
    this.props.getScore(newScore);
    this.props.sortByScore();
  },

  downVote(id, number) {
    let newNumber = number-1;
    let newScore = {
      createAt: id,
      score: newNumber
    }
    this.props.getScore(newScore);
    this.props.sortByScore();
  },

  render() {
    let { movies } = this.props;
    let rows = movies.map(movie => {
      return (
        <tr key={movie.createAt}>
          <td>
            <img src={movie.pic_url} height="200" width="150"/>
          </td>
          <td>{movie.name}</td>
          <td>{movie.score}</td>
          <td>
            <button className='btn btn-success btn-md' onClick={this.upVote.bind(null, movie.createAt, movie.score)}>
              <i className='glyphicon glyphicon-thumbs-up'></i>
            </button>
            <button className='btn btn-danger btn-md' onClick={this.downVote.bind(null, movie.createAt, movie.score)}>
              <i className='glyphicon glyphicon-thumbs-down'></i>
            </button>
          </td>
        </tr>
      )
    });

    return (
      <table className="table table-striped">
        <thead>
          <tr className="info tbr">
            <td>PICTURE</td>
            <td>NAME</td>
            <td>SCORE</td>
            <td>VOTE</td>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
});

const MovieForm = React.createClass({
  getInitialState() {
    return {
      name: '',
      pic_url: '',
      score: 0,
      createAt: ''
    }
  },

  inputNameChange(e) {
    let name = e.target.value;
    this.setState({ name });
  },

  inputPictureChange(e) {
    let pic_url = e.target.value;
    this.setState({ pic_url });
  },

  _onSumbit(e) {
    e.preventDefault();
    let newMovie = {
      name: this.state.name,
      pic_url: this.state.pic_url,
      createAt: Date.now(),
      score: 0
    };

    this.props.addMovie(newMovie);

    this.setState({
      name: '',
      pic_url: '',
      createAt: ''
    });
  },

  render() {
    return (
      <div className = 'row'>
        <form className="form-inline" onSubmit={e => this._onSumbit(e)}>
          <div className="form-group">
            <label >NAME :</label>&nbsp;
            <input
              type="text"
              className="form-control"
              placeholder="Movie name"
              value={this.state.name}
              onChange={this.inputNameChange}
            />&nbsp;&nbsp;
          </div>
          <div className="form-group">
            <label >PICTURE :</label>&nbsp;
            <input
              type="text"
              className="form-control"
              placeholder="pic_url"
              value={this.state.pic_url}
              onChange={this.inputPictureChange}
            />&nbsp;&nbsp;
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>
      </div>
    )
  }
});





ReactDOM.render(
  <App />,
  document.getElementById('root')
);
