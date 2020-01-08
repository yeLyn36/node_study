var url = require('url');

var curUrl = url.parse(
  'https://m.search.naver.com/search.naver?query=steve+job&where=m&sm=mtp_hty'
);

var curStr = url.format(curUrl);
console.log('주소 문자열 : %s', curStr);
console.dir(curUrl);

//요청 파라미터 구분하기
var queryString = require('querystring');

var param = queryString.parse(curUrl.query);

console.log('요청 파라미더 중 query의 값 : %s', param.query);
console.log('원본 요청 파라미터 : %s', queryString.stringify(param));
