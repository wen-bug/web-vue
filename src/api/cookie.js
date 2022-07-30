export const setCookie = function (cname, cvalue ,time) {
    var d = new Date();
    d.setTime(d.getTime() + time * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  };