import React from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import Shelf from './Shelf'
import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    currentlyReadingBooks: [],
    wantToReadBooks: [],
    readBooks: [],
    noneBooks: [],
    searchedBooks: []

  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      var currentlyReadingBooks = books.filter(book=>book.shelf==="currentlyReading");
      var wantToReadBooks = books.filter(book=>book.shelf==="wantToRead");
      var readBooks = books.filter(book=>book.shelf==="read");
      this.setState({ currentlyReadingBooks, wantToReadBooks, readBooks });
    })
  }

  moveBook = (book, to) => {
    if (book.shelf!==to) {
      BooksAPI.update(book, to).then(res => {
        const fromShelfName = book.shelf + "Books";
        const toShelfName = to + "Books";
        book.shelf = to;
        this.setState(state => ({
          [fromShelfName]: state[fromShelfName].filter(b=>b.id!==book.id),
          [toShelfName]: state[toShelfName].concat([ book ]),
        }));
      });
    }
  }

  updateQuery = (q) => {
    BooksAPI.search(q).then(books => {
      var searchedBooks = books;
      if (searchedBooks===undefined||searchedBooks===null||searchedBooks.error!==undefined) {
        searchedBooks = [];
      }
      searchedBooks.forEach(book => {
        if (book.shelf===undefined) {
          book.shelf = "none";
          if (this.state.currentlyReadingBooks.filter(b=>b.id===book.id).length!==0) {
            book.shelf = "currentlyReading";
          } else if (this.state.wantToReadBooks.filter(b=>b.id===book.id).length!==0) {
            book.shelf = "wantToRead";
          } else if (this.state.readBooks.filter(b=>b.id===book.id).length!==0) {
            book.shelf = "read";
          }
        }
      });
      this.setState({ searchedBooks });
    });
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={() => (
            <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <Shelf title="Currently Reading" books={this.state.currentlyReadingBooks} onMoveBook={this.moveBook}/>
                <Shelf title="Want to Read" books={this.state.wantToReadBooks} onMoveBook={this.moveBook}/>
                <Shelf title="Read" books={this.state.readBooks} onMoveBook={this.moveBook}/>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search" onClick={() => this.setState({ searchedBooks: [] })}>Add a book</Link>
            </div>
          </div>
          )}/>
        <Route path='/search' exact render={() => (
            <div className="search-books">
            <div className="search-books-bar">
            <Link to="/" className="close-search" onClick={() => this.setState({ searchedBooks: [] })}>Close</Link>
            <div className="search-books-input-wrapper">
              {/*
                NOTES: The search from BooksAPI is limited to a particular set of search terms.
                You can find these search terms here:
                https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                you don't find a specific author or title. Every search is limited by search terms.
              */}
              <input type="text" placeholder="Search by title or author" onChange={(event) => this.updateQuery(event.target.value)} />

            </div>
            </div>
            <div className="search-books-results">
              <Shelf books={this.state.searchedBooks} onMoveBook={this.moveBook}/>
            </div>
          </div>
          )}/>
      </div>
    )
  }
}

export default BooksApp
