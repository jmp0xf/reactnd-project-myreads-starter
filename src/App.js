import React from 'react'
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
    showSearchPage: false,
    currentlyReadingBooks: [],
    wantToReadBooks: [],
    readBooks: []

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

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
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
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
