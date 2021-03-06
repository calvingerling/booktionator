import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { BookService } from '../../shared/services/book.service';

import { Book } from 'types/book';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private bookService: BookService;
  private route: ActivatedRoute;

  mode: string;

  @ViewChild(SearchBarComponent)
  searchBar: SearchBarComponent;

  books: Book[];
  bookLink: string;

  instructions: string;
  modes: { [key: string]: string };
  instructionsMessages: { [key: string]: string };

  constructor(bookService: BookService, route: ActivatedRoute) {
    this.bookService = bookService;
    this.route = route;

    this.modes = {
      'sell': '/book/sell',
      'find': '/book/details'
    };

    this.instructionsMessages = {
      'sell': 'Procure um livro ou cadastre um que ainda não existe no botão \'+\' para anunciar',
      'find': 'Procure um livro para ver os detalhes e comprar'
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.searchBar.term = '';

      let { term } = params;
      if (term) {
        this.searchBar.term = term;
        this.search();
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      this.mode = queryParams.mode;

      this.bookLink = this.modes[this.mode];
      this.instructions = this.instructionsMessages[this.mode];
    });
  }

  search(): void {
    this.bookService.search(this.searchBar.term).subscribe((res) => {
      this.books = res.json().result.map((val) => this.mapBook(val));
    });
  }

  createSearch(): Function {
    return this.search.bind(this);
  }

  private mapBook(value: any): Book {
    const { uid, title, synopsis, author, date, publisher, score, imageUrl } = value;
    return new Book(uid, title, synopsis, author.name._name, new Date(date), publisher, parseInt(score), imageUrl);
  }
}
