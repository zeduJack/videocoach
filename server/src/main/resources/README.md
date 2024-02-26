openssl req -new -x509 -nodes -days 365 -keyout key.pem -out cert.pem -config san.cnf
openssl pkcs12 -export -in cert.pem -inkey key.pem -out keystore.p12 -name tomcat
