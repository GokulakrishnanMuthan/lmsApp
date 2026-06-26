import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../interfaces/book'; 
import { BookIssue } from '../interfaces/bookissue'; 
import { BookVO } from '../interfaces/bookVo';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Devote } from '../interfaces/devote';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  apiUrl="http://localhost:8080/lms/";
  apiUrlRole="http://localhost:3000/role";
  //apiUrlBooks="http://localhost:3000/book";
  apiUrlDevotes="http://localhost:3000/devote";


  // User Details
  getAll(){
    return this.http.get(this.apiUrl+"getAllUsers");
  }

  getByCode(code:any){
    return this.http.get(this.apiUrl+"getUser/"+code);
  }

  authentication(userData:any){
    const postData = {
      name: userData.value.name,
      password: userData.value.password  // Fixed the field to use password instead of email
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Make the POST request
    return this.http.post(this.apiUrl + "authentication", postData, { headers });
  }

  proceedRegister(userData:any){
    return this.http.post(this.apiUrl, userData);
  }

  updateUser(code:any,userData:any){
    return this.http.put(this.apiUrl+"/"+code, userData);
  }


  isLoggedIn(){
    return sessionStorage.getItem("username")!=null;
  }

  // Roles Details
  getUserRole(){
    return sessionStorage.getItem("userrole")!=null? sessionStorage.getItem("userrole")?.toString():'';
  }

  getAllRole(){
    return this.http.get(this.apiUrlRole);
  }

  // Book Details

  getAllBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl+"getAllBooks");
  }
  getBookById(id:any){
    return this.http.get(this.apiUrl+"books/"+id);
  }

  
  saveBook(bookData:any){
    return this.http.post(this.apiUrl+"book", bookData);
  }

  saveIssueBook(bookData:any,devoteData:any){
   // console.log("bookData-->"+JSON.stringify(bookData));
   // console.log("devoteData-->"+JSON.stringify(devoteData));
   // console.log("totalAmount-->"+JSON.stringify(totalAmount));
    var data = {'devoteObj': devoteData, 'bookList': bookData };
   // console.log("data-->"+JSON.stringify(data));
    return this.http.post(this.apiUrl+"bookIssue", data).subscribe(response => {
     // console.log(response);
    });
  }

  getAllDevotes(){
    return this.http.get(this.apiUrl+"getAllDevotes");
  }

 
   getAllBookIssues(): Observable<BookIssue[]>{
    return this.http.get<BookIssue[]>(this.apiUrl+"getAllBookIssues");
  }

  getAvailableBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl+"getAvailableBooks");
  }

  
  loadDashboardDetails(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl+"loadDashboardDetails");
  }

  getBookReturnDetails(devoteId:any,issueDate:any){
    return this.http.get(this.apiUrl+"returnBook/"+devoteId+"/"+issueDate);
  }

  // Look up the open issue for a single copy by its access number (barcode scan).
  getReturnByAccessno(accessno:any): Observable<any>{
    return this.http.get<any>(this.apiUrl+"returnByAccessno/"+accessno);
  }


  
  returnBook(bookData:any): Observable<any> {
    // console.log("bookData-->"+JSON.stringify(bookData));
    // console.log("devoteData-->"+JSON.stringify(devoteData));
    // console.log("totalAmount-->"+JSON.stringify(totalAmount));
     var data = {'bookIssueDetailsList': bookData };
     //console.log("data-->"+JSON.stringify(data));
     return this.http.post(this.apiUrl+"bookreturn", data);
   }

   getAllBookwiseIssuesList(): Observable<BookIssue[]>{
    return this.http.get<BookIssue[]>(this.apiUrl+"getAllBookwiseIssuesList");
  }

  
  getDevoteByPhone(devotePhone:any): Observable<Devote>{
    return this.http.get<Devote>(this.apiUrl+"devote/"+devotePhone);
  }



  booklentdatewise(issuestartDate:any,issueendDate:any){
    return this.http.get(this.apiUrl+"booklentdatewise?start="+issuestartDate+"&end="+issueendDate);
  }


  
  bookwiselentreport(bookId:any){
    return this.http.get(this.apiUrl+"bookwiselentreport/"+bookId);
  }


  bookwiseissuedreport(bookId:any){
    return this.http.get(this.apiUrl+"bookwiseissuedreport/"+bookId);
  }

  
  printBarCode(id:any){
    return this.http.get(this.apiUrl+"book/"+id+"/barcode", {responseType: 'blob'});
  }

  getAllRackList(){
    return this.http.get(this.apiUrl+"getAllRackList");
  }

  getRackById(id:any){
    return this.http.get(this.apiUrl+"rack/"+id);
  } 

  saveRack(rackData:any){
    return this.http.post(this.apiUrl+"saveRack", rackData);
  }

  getAllRackListwithBookCount(){
    return this.http.get(this.apiUrl+"getAllRackListwithBookCount");
  }


  devotesList(){
    return this.http.get(this.apiUrl+"devote");
  }


deleteDevotee(id: number) {
  return this.http.put(this.apiUrl+`devotees/${id}/delete`, {});
}

 getCurrentYear() {
    return this.http.get<any>(`${this.apiUrl}academic-year/current`);
  }

  addNextYear(fromDate: string, toDate: string) {
    return this.http.post<any>(`${this.apiUrl}academic-year/next`, { fromDate, toDate });
  }


 
  getAcademicYear(): Observable<string> {
  return this.http.get(`${this.apiUrl}getAcademicYear`, {
    responseType: 'text'  
  });
}

  saveDevotee(devotee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}devotesave`, devotee);
  }

} 
