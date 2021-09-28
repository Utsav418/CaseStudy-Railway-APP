import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {HttpClientModule} from '@angular/common/http'
import {HttpClient} from '@angular/common/http'
import 'rxjs/add/operator/map'
// import 'rxjs/Rx';
@Injectable({ providedIn: 'root' })
export class HttpWebService {

  constructor(private http: Http) { }

  getSignInConfirmation(username: string, password: string) {
    const url = 'http://localhost:3000/login';
    const reqBody = {
      'identifier': username,
      'password': password
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());

    return req;
  }

  verifyUserLogin(token: string | null) {
    const url = 'http://localhost:3000/login/signOn';
    const options = new RequestOptions({headers : new  Headers({ 'authorization': token})});
    const reqBody = '';
    const req = this.http.post(url, reqBody, options ).map((res: Response) => res.json());

    return req;
  }


  createNewUser(username: string, password: string, aadhaar: string, PAN: string, occupation: string, firstname: string, lastname: string, dob: string, phone: string, address: string, city: string, state: string, country: string, zip: string, usertype: string) {
    const url = 'http://localhost:3000/signUpUser';
    const reqBody = {
      'email': username,
      'password': password,
      'lang': 'english',
      'firstName': firstname,
      'lastName': lastname,
      'dob': dob,
      'aadhaar': aadhaar,
      'pan': PAN,
      'occupation': occupation,
      'countryCode': '+91',
      'phone': phone,
      'address': address,
      'city': address,
      'state': state,
      'country': country,
      'pin': zip,
      // 'userType': 'user',
      'userType': usertype,

      'lastLoggIn': 'NA',
      'sessionStatus': 'Not Verified',
      'currentSession': 'NA'
    };
    const req = this.http.post(url, reqBody);
    req.subscribe();
  }

  createOTP(userid: string | null) {
    const url = 'http://localhost:3000/verifyUserChallenge';
    const reqBody = {
      'identifier': userid
    };

    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }


  sendOTPVerification(userid: string | null, session_id: string | null, otp: string) {
    const url = 'http://localhost:3000/verifyOTP';
    const reqBody = {
      'identifier': userid,
      'session_id': session_id,
      'otpn': otp
    };

    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  fetchAllStations(userid: any) {
    const url = 'http://localhost:3000/api/stations';
    const req = this.http.get(url).map((res: Response) => res.json());
    return req;
  }

  getTrainsBetStn(from: string, to: string) {
    const url = 'http://localhost:3000/api/stations/betw';
    const reqBody = {
      'station1': from,
      'station2': to
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  // tslint:disable-next-line:max-line-length
  createProvisionalId(reservationType: string, name: string, age: string, gender: string, mobile: string, address: string, quota: string, nationPref: string, vcardtype: string, vcardname: string, berth: string, classPref: string, mealType: string, conssPref: string) {
    const url = 'http://localhost:3000/api/booking/provisional';
    const reqBody = {
      'userid': window.sessionStorage.getItem('userid'),
      'reservationType': reservationType,
      'fromStn': window.localStorage.getItem('fromStation'),
      'toStn': window.localStorage.getItem('toStation'),
      'journeyDt': window.localStorage.getItem('journeyDt'),
      'trainNo': window.localStorage.getItem('trainNo'),
      'bookingDt': Date.now(),
      'name': name,
      'age': age,
      'gender': gender,                
      'mobile': mobile,
      'address': address,
      'quotaType': quota,
      'nationality': nationPref,
      'identitytype': vcardtype,
      'identityNumber': vcardname,
      'berth': berth,
      'class': classPref,
      'mealType': mealType,
      'concessions': conssPref,
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }


  fetchFareDetails(proviD: string | null) {
    const url = 'http://localhost:3000/api/payment/getDetails';
    const reqBody = {
      'provisionalNumber': proviD,
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  generatePayment(trainNo: string, provisionalId: string, totalFare: string, cardNo: string, holdername: string, validDt: string) {
    const url = 'http://localhost:3000/api/payment/verify';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
      'trainNo': trainNo,
      'provisionalNumber': provisionalId,
      'totalFare': totalFare,
      'cardNo': cardNo,
      'holder_name': holdername,
      'validTill': validDt
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  verifyPayment(provisionalId: string, otp_sent: string, totalFare: string) {
    const url = 'http://localhost:3000/api/payment/verifiedUser';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
      'session_id': window.sessionStorage.getItem('session_id'),
      'provisionalNumber': provisionalId,
      'otp': otp_sent,
      'totalFare': totalFare,
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  myBookings() {
    const url = 'http://localhost:3000/api/booking/history';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }
  
   baseURL = 'http://localhost:3000/api/booking/history';
    cancelBooking(_id: string) {
      return this.http.delete(this.baseURL + `/${_id}`);
    }


  myPNRSearch(pnr: string | null) {
    const url = 'http://localhost:3000/api/booking/pnr/search';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
      'pnrNumber': pnr,
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  sendPasswordChangeRequest(userid: string) {
    const url = 'http://localhost:3000/password/verifyUser';
    const reqBody = {
      'identifier': userid,
    };
    const req = this.http.post(url, reqBody);
    req.subscribe();
  }

  validatePasswordChangeRequest(userid: any, sthoren: string) {
    const url = 'http://localhost:3000/password/verify/shortener';
    const reqBody = {
      'identifier': userid,
      'shortLink': sthoren,
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  updatePasswordRequest(userid: any, sthoren: string, password: string) {
    const url = 'http://localhost:3000/password/changePassword';
    const reqBody = {
      'identifier': userid,
      'shortLink': sthoren,
      'password': password,
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  profileDetlCheck() {
    const url = 'http://localhost:3000/api/myprofile/details';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  signInDetails() {
    const url = 'http://localhost:3000/api/sigin/details';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  createNotification(user: string | null, notif_tl: string, desc: string) {
    const url = 'http://localhost:3000/api/notification/create';
    const reqBody = {
      userid: user,
      dateOfCreation: Date.now(),
      title: notif_tl,
      description: desc
    };
    const req = this.http.post(url, reqBody);
    req.subscribe();
  }

  viewNotifications() {
    const url = 'http://localhost:3000/api/notification/view';
    const reqBody = {
      'identifier': window.sessionStorage.getItem('userid'),
    };
    const req = this.http.post(url, reqBody).map((res: Response) => res.json());
    return req;
  }

  readNotification(id: any, email: any) {
    const url = 'http://localhost:3000/api/notification/read';
    const reqBody = {
      idrq: id,
      identifier: email,
    };
    const req = this.http.post(url, reqBody);
    req.subscribe();
  }

}
