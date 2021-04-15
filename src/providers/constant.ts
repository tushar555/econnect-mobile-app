export class Constant {
  public static BASE_URL = "";

  public static lta = Constant.BASE_URL + "assets/data/lta.json";

  public static hospital = Constant.BASE_URL + "assets/data/hospital.json";

  public static base_url = "https://mmfss-econnectweb.azurewebsites.net/api/"; //UAT

  //public static base_url = "https://mmfslweconnect.azurewebsites.net/api/"; //Production

  //apiUrl = "https://mmfss-econnectweb.azurewebsites.net/api/";

  public static getSalarySlip = Constant.base_url + "SalaryCard/getSalaryCard";

  public static userAuthentication = Constant.base_url + "Account/Authenticate";

  public static CheckPinLogin = Constant.base_url + "Account/CheckPinLogin";
  // public static userAuthentication = Constant.base_url + 'Account/AuthenticateNoLDAP';
  public static mapUrl =
    "https://www.google.com/maps/embed/v1/search?key=AIzaSyCW7dI5cvBn9V2hctlTS3Xl_HmLZ33b3eI&q=";
}
