curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: b4e8c71d-762c-1401-7716-0cc737092872" -d 'email=ansafahmad70@gmail.com&password=portcredit' "http://localhost:3000/users/login"
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: 23526abf-5fd6-69f1-e6c0-d1b6b9edc683" -d 'email=admin@admin.com&password=admin' "http://localhost:3000/users/signup"
curl -X GET -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: 8c511842-5fc1-e10b-d606-335daa285a05" "http://localhost:3000/users/validate/Token"
curl -X GET -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: 6fdb6728-9e0d-56d1-2dd3-362c3704faef" "http://localhost:3000/users"
curl -X GET -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: f4893b7e-d21b-b4d0-76e1-9792b7160738" "http://localhost:3000/users/adminAccount"
curl -X PUT -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: db8b1971-c93d-e2e9-aabe-2097a6615d87" -d 'email=admin@administrator.com&password=admin' "http://localhost:3000/users/editProfile/adminAccount"
curl -X PUT -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: db8b1971-c93d-e2e9-aabe-2097a6615d87" -d 'email=admin@admin.com&password=admin' "http://localhost:3000/users/editProfile/adminAccount"