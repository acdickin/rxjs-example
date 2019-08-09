import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounce, switchMap, map, distinctUntilChanged, tap } from 'rxjs/operators';
import { Subject, timer, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Gives back an observable
  constructor(private http: HttpClient) {}
  title = 'the Cute Reddit Image Search';
  searchString$ = new Subject<string>();
  results$: Observable<any>;

  ngOnInit() {
    this.results$ = this.searchString$.pipe(debounce(() => timer(1000)))
    .pipe(distinctUntilChanged())
    .pipe(tap(x => console.log('tap', x)))
    .pipe(switchMap(searchString => this.queryAPI(searchString)));
  }
  inputChanged($event) {
    console.log('input changed', $event);
    this.searchString$.next($event);
  }
  queryAPI(searchString){
    console.log('queryAPI', searchString);
    return this.http.get(`http://www.reddit.com/r/aww/search.json?q="${searchString}"`)
      .pipe(map(result => result['data']['children'] ));
  }
  ngOnDestroy() {
  }
}
