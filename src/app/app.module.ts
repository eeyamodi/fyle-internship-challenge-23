import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from  '@angular/common/http';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { SearchComponent } from './search/search.component';
import { RepocardComponent } from './repocard/repocard.component';
import { PageselectorComponent } from './pageselector/pageselector.component';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UserdetailsComponent,
    SearchComponent,
    RepocardComponent,
    PageselectorComponent
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { 

}